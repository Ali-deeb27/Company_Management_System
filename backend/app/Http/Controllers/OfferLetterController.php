<?php

namespace App\Http\Controllers;

use App\Models\OfferLetter;
use Illuminate\Http\Request;

class OfferLetterController extends Controller
{
      public function send(Request $request, $applicationId)
    {
        $data = $request->validate([
            'offer_date' => 'required|date',
            'salary' => 'nullable|numeric'
        ]);

        return OfferLetter::create([
            'job_application_id' => $applicationId,
            'offer_date' => $data['offer_date'],
            'salary' => $data['salary'] ?? null,
            'status' => 'sent'
        ]);
    }

    public function respond(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected'
        ]);

        $offer = OfferLetter::findOrFail($id);
        $offer->update(['status' => $request->status]);

        return response()->json(['message' => 'Offer response recorded']);
    }
}
