<?php

namespace App\Http\Controllers\Api;

use App\Models\Document;
use App\Models\DocumentVersion;
use App\Http\Requests\StoreDocumentRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;



class DocumentController extends Controller
{
      public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'file' => 'required|file|mimes:pdf,doc,docx',
        'associated_entity' => 'nullable|in:company,employee,project,department',
    ]);

    $user = $request->user();

    // 1️⃣ Create document record
    $document = Document::create([
        'title' => $validated['title'],
        'uploaded_by' => $user->id,
        'associated_entity' => $validated['associated_entity'] ?? 'company',
        'link' => '', // placeholder, will set after storing file
    ]);

    // 2️⃣ Store file in public disk
    $file = $validated['file'];
    $versionNumber = 1; // first version
    $folder = "documents/{$document->id}/v{$versionNumber}";
    $fileName = $file->getClientOriginalName();

    // ✅ Store in public disk
    $file->storeAs($folder, $fileName, 'public');

    // 3️⃣ Update document link with **relative path only**
    $document->update([
        'link' => "{$folder}/{$fileName}"
    ]);

    // 4️⃣ Create version record
    DocumentVersion::create([
        'document_id' => $document->id,
        'version_number' => $versionNumber,
        'file_path' => "{$folder}/{$fileName}",
        'uploaded_by' => $user->id,
        'change_log' => 'Initial version',
    ]);

    return response()->json([
        'message' => 'Document uploaded successfully',
        'document' => $document
    ]);
}

    public function index(Request $request){
        $user = $request->user();

    
        if (in_array($user->role, ['admin', 'HR_manager'])) {
            $documents = Document::with('versions')->get();
            return response()->json($documents);
        }

    
        $query = Document::with('versions')->where(function($q) use ($user) {
        // Always include company-wide documents
            $q->where('associated_entity', 'company');

        // Employee-linked documents
            if ($user->role == 'employee') {
                $q->orWhere('associated_entity', 'employee')
                ->where('link', 'like', "%{$user->id}%"); // optional: link contains user id
            }

        // Department-linked documents
            if ($user->department_id) {
                $q->orWhere('associated_entity', 'department')
                ->where('link', 'like', "%{$user->department_id}%"); // optional
            }

        // Project-linked documents (if assigned to projects)
        // Assuming you have a relation $user->projects
            if ($user->role == 'project_manager' || $user->role == 'employee') {
                $projectIds = $user->projects()->pluck('id')->toArray();
                $q->orWhere('associated_entity', 'project')
                ->whereIn('id', $projectIds); // adjust according to your structure
            }
        });

        $documents = $query->get();

        return response()->json($documents);
    }

    public function show(Request $request, $id){
        $user = $request->user();

    
        $document = Document::with('versions')->find($id);

        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

    // Check access based on role & associated_entity
        $allowed = false;

        if (in_array($user->role, ['admin', 'HR_manager'])) {
            $allowed = true; // Admin/HR can access any document
        } else {
            switch ($document->associated_entity) {
                case 'company':
                    $allowed = true;
                    break;

                case 'employee':
                    $allowed = $document->link && str_contains($document->link, (string)$user->id);
                    break;

                case 'department':
                    $allowed = $user->department_id && str_contains($document->link, (string)$user->department_id);
                    break;

                case 'project':
                // Assuming user has projects relation
                    $projectIds = $user->projects()->pluck('id')->toArray();
                    $docProjectId = $document->project_id ?? null; // optional field if documents linked to project
                    $allowed = $docProjectId && in_array($docProjectId, $projectIds);
                    break;

                default:
                    $allowed = false;
            }
        }

        if (!$allowed) {
            return response()->json(['message' => 'Unauthorized to view this document'], 403);
        }

    // Get latest version
        $latestVersion = $document->versions()->orderByDesc('version_number')->first();

    // Return metadata and latest version
        return response()->json([
            'id' => $document->id,
            'title' => $document->title,
            'associated_entity' => $document->associated_entity,
            'link' => $document->link,
            'latest_version' => $latestVersion ? [
                'version_number' => $latestVersion->version_number,
                'file_path' => $latestVersion->file_path,
                'uploaded_by' => $latestVersion->uploaded_by,
                'uploaded_at' => $latestVersion->created_at,
                'change_log' => $latestVersion->change_log,
            ] : null,
            'all_versions' => $document->versions,
        ]);
    }

    public function update(Request $request, $id){
        $user = $request->user();

    
        $document = Document::find($id);

        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

    
        if (!in_array($user->role, ['admin', 'HR_manager', 'department_manager', 'project_manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'associated_entity' => 'sometimes|in:company,employee,project,department',
        ]);

    
        if (!empty($validated)) {
            $document->update($validated);
        }

    //Return updated document
        return response()->json([
            'message' => 'Document metadata updated successfully',
            'document' => $document
        ]);
    }

    public function destroy(Request $request, $id){
        $user = $request->user();

    
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    
        $document = Document::with('versions')->find($id);

        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

    
        foreach ($document->versions as $version) {
            if (Storage::disk('public')->exists($version->file_path)) {
                Storage::disk('public')->delete($version->file_path);
            }
        }

    
        $folderPath = "documents/{$document->id}";
        if (Storage::disk('public')->exists($folderPath)) {
            Storage::disk('public')->deleteDirectory($folderPath);
        }

    
        $document->delete();

    
        return response()->json([
            'message' => 'Document and all versions deleted successfully'
        ]);
    }

    public function download(Request $request, $id)
{
    $user = $request->user();
    $document = Document::with(['versions' => fn($q) => $q->orderByDesc('version_number')])->find($id);

    if (!$document) return response()->json(['message'=>'Document not found'], 404);

    $latest = $document->versions->first();
    if (!$latest) return response()->json(['message'=>'No version found'], 404);

    
    if (!in_array($user->role, ['admin','HR_manager'])) {
        if ($document->associated_entity === 'employee' && !str_contains($document->link, (string)$user->id)) {
            return response()->json(['message'=>'Unauthorized'], 403);
        }
        // add other entity checks if needed
    }

    //Download file
    if (!Storage::disk('public')->exists($latest->file_path)) {
        return response()->json(['message'=>'File not found on server'], 404);
    }
    

    $filePath = storage_path('app/public/' . $latest->file_path);
    return response()->download($filePath);
    }

    public function versions(Request $request, $id){
        $user = $request->user();

        //Fetch document with versions and uploader info
        $document = Document::with([
            'versions' => function ($query) {
                $query->orderByDesc('version_number');
            },
            'versions.uploader:id,name'
        ])->find($id);

        if (!$document) {
            return response()->json([
                'message' => 'Document not found'
            ], 404);
        }

    
        if (!in_array($user->role, ['admin', 'HR_manager', 'manager', 'department_manager'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        //Format response
        $versions = $document->versions->map(function ($version) {
            return [
                'id' => $version->id,
                'version' => $version->version_number,
                'file_path' => $version->file_path,
                'uploaded_by' => $version->uploader->name ?? null,
                'change_log' => $version->change_log,
                'uploaded_at' => $version->created_at,
            ];
        });

        return response()->json([
            'document_id' => $document->id,
            'document_title' => $document->title,
            'total_versions' => $versions->count(),
            'versions' => $versions
        ]);
    }


    public function uploadVersion(Request $request, $id){
        $user = $request->user();

    
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx',
            'change_log' => 'nullable|string|max:500',
        ]);

    
        $document = Document::find($id);
        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

    
        if (!in_array($user->role, ['admin', 'HR_manager', 'department_manager', 'project_manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Determine next version number
        $latestVersion = $document->versions()->orderByDesc('version_number')->first();
        $versionNumber = $latestVersion ? $latestVersion->version_number + 1 : 1;

        //Store file in public disk
        $file = $validated['file'];
        $folder = "documents/{$document->id}/v{$versionNumber}";
        $fileName = $file->getClientOriginalName();
        $file->storeAs($folder, $fileName, 'public'); 

        $filePath = "{$folder}/{$fileName}";

    
        $version = DocumentVersion::create([
            'document_id' => $document->id,
            'version_number' => $versionNumber,
            'file_path' => $filePath,
            'uploaded_by' => $user->id,
            'change_log' => $validated['change_log'] ?? 'No description',
        ]);

    
        $document->update(['link' => $filePath]);

    
        return response()->json([
            'message' => "Version {$versionNumber} uploaded successfully",
            'version' => $version
        ]);
    }

    public function viewVersion(Request $request, $id, $versionId){
        $user = $request->user();

    
        $document = Document::find($id);
        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

    
        $version = $document->versions()->where('id', $versionId)->first();
        if (!$version) {
            return response()->json(['message' => 'Version not found'], 404);
        }

    
        if (!in_array($user->role, ['admin', 'HR_manager', 'department_manager', 'project_manager'])) {
            // employees or interns can only see their own documents
            if ($document->associated_entity === 'employee' && !str_contains($document->link, (string)$user->id)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

    
        $versionData = [
            'id' => $version->id,
            'document_id' => $document->id,
            'document_title' => $document->title,
            'version_number' => $version->version_number,
            'file_path' => $version->file_path,
            'uploaded_by' => $version->uploader->name ?? null,
            'change_log' => $version->change_log,
            'uploaded_at' => $version->created_at,
        ];

        return response()->json($versionData);
    }

    public function deleteVersion(Request $request, $id, $versionId){
        $user = $request->user();

    
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    
        $document = Document::with('versions')->find($id);
        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

    
        $version = $document->versions->where('id', $versionId)->first();
        if (!$version) {
            return response()->json(['message' => 'Version not found'], 404);
        }

    
        $latestVersion = $document->versions->sortByDesc('version_number')->first();
        if ($version->id === $latestVersion->id) {
            return response()->json(['message' => 'Cannot delete the latest version'], 400);
        }

    
        if (Storage::disk('public')->exists($version->file_path)) {
            Storage::disk('public')->delete($version->file_path);
        }

    
        $version->delete();

        return response()->json([
            'message' => "Version {$version->version_number} deleted successfully"
        ]);
    }

    public function linkDocument(Request $request, $id)
{
        $user = $request->user();

    
        if (!in_array($user->role, ['admin', 'HR_manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    
        $validated = $request->validate([
            'entity_type' => 'required|string|in:employee,project,department',
            'entity_id' => 'required|integer',
        ]);

    
        $document = Document::find($id);
        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        //Link the document
        $linkData = [
            'entity_type' => $validated['entity_type'],
            'entity_id' => $validated['entity_id'],
        ];

        $document->update([
            'associated_entity' => $validated['entity_type'],
            'link' => json_encode($linkData),
        ]);

        return response()->json([
            'message' => "Document linked successfully to {$validated['entity_type']} ID {$validated['entity_id']}",
            'document' => $document
        ]);
    }

    public function getByEntity(Request $request, $type, $id){
    
        if (!in_array($type, ['employee', 'project', 'department'])) {
            return response()->json(['message' => 'Invalid entity type'], 400);
        }

        $user = $request->user();

    
        if (in_array($user->role, ['admin', 'HR_manager'])) {
            $documents = Document::where('associated_entity', $type)
                ->where('link', 'like', '%"entity_id":'.$id.'%')
                ->get();
        }else {
            switch ($type) {
                case 'employee':
                    if (!isset($user->employee) || $user->employee->id != $id) {
                        return response()->json([], 200);
                    }
                    break;
                case 'project':
                    $managedProjectIds = $user->managedProjects->pluck('id')->toArray();
                    if (!in_array($id, $managedProjectIds)) {
                        return response()->json([], 200);
                    }
                    break;
                case 'department':
                    if ($user->department_id != $id) {
                        return response()->json([], 200);
                    }
                    break;
            }
            $documents = Document::where('associated_entity', $type)
                ->where('link', 'like', '%"entity_id":'.$id.'%')
                ->get();
        }
        return response()->json($documents);
    }
}