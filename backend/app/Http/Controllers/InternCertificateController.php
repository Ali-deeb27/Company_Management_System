<?php

namespace App\Http\Controllers;

use App\Models\Intern;
use App\Models\InternCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InternCertificateController extends Controller
{
	public function issue(Request $request, $internId)
	{
		$request->validate([
			'certificate' => 'required|file|mimes:pdf,jpg,jpeg,png',
			'issued_at' => 'required|date',
			'issued_by' => 'required|integer|exists:employees,id',
		]);

		$intern = Intern::findOrFail($internId);

		$path = $request->file('certificate')->store('', 'public');

		$certificate = InternCertificate::create([
			'intern_id' => $intern->id,
			'certificate_path' => $path,
			'issued_at' => $request->issued_at,
			'issued_by' => $request->issued_by,
		]);

		return response()->json(['message' => 'Certificate issued successfully', 'certificate' => $certificate], 201);
	}

	public function show($internId)
	{
		$certificate = InternCertificate::where('intern_id', $internId)->first();
		if (!$certificate) {
			return response()->json(['message' => 'Certificate not found'], 404);
		}
		return response()->json($certificate);
	}

	public function download($internId)
	{
		$certificate = InternCertificate::where('intern_id', $internId)->first();
		if (!$certificate) {
			return response()->json(['message' => 'Certificate not found'], 404);
		}
		return response()->download(public_path($certificate->certificate_path));
	}

	public function destroy($internId)
	{
		$certificate = InternCertificate::where('intern_id', $internId)->first();
		if (!$certificate) {
			return response()->json(['message' => 'Certificate not found'], 404);
		}
		Storage::disk('public')->delete($certificate->certificate_path);
		$certificate->delete();
		return response()->json(['message' => 'Certificate deleted successfully']);
	}
}
