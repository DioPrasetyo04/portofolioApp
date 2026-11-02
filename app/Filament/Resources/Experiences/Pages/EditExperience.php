<?php

namespace App\Filament\Resources\Experiences\Pages;

use App\Filament\Resources\Experiences\ExperienceResource;
use App\Models\Experience;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditExperience extends EditRecord
{
    protected static string $resource = ExperienceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (isset($data['media']) && is_array($data['media'])) {
            $data['media'] = array_values(array_filter(array_map(function ($item) {
                return is_array($item) ? ($item['path'] ?? null) : $item;
            }, $data['media'])));
        }

        if (isset($data['points']) && is_array($data['points'])) {
            $data['points'] = array_values(array_filter(array_map(function ($p) {
                return is_array($p) && isset($p['item']) ? $p['item'] : (is_string($p) ? $p : '');
            }, $data['points'])));
        }

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['media']) && is_array($data['media'])) {
            $data['media'] = Experience::indexUploadedMedia($data['media']);
        }

        if (isset($data['points']) && is_array($data['points'])) {
            $data['points'] = array_values(array_filter(array_map(function ($p) {
                return is_array($p) && isset($p['item']) ? trim($p['item']) : (is_string($p) ? trim($p) : '');
            }, $data['points']), fn ($val) => $val !== ''));
        }

        return $data;
    }
}

