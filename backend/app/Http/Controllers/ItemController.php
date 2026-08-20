<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = min(max($perPage, 1), 100);

        $items = Item::orderBy('updated_at', 'desc')->paginate($perPage);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:32',
            'description' => 'nullable|string|max:65535',
        ]);

        $item = Item::create($validated);

        return response()->json($item, 201);
    }

    public function update(Request $request, string $id)
    {
        $item = Item::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:32',
            'description' => 'nullable|string|max:65535',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy(string $id)
    {
        $item = Item::findOrFail($id);
        $item->delete();

        return response()->json(null, 204);
    }
}