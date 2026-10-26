<?php

namespace Database\Seeders;

use App\Models\Resume;
use Illuminate\Database\Seeder;

class ResumeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Resume::firstOrCreate(
            ['file_path' => 'resumes/Dio_Prasetyo_CV.pdf'],
            [
                'title' => [
                    'en' => 'Dio Prasetyo - Software Engineer / Full Stack Developer Resume',
                    'id' => 'Dio Prasetyo - Resume & CV Software Engineer',
                    'zh' => 'Dio Prasetyo - 软件工程师 / 全栈开发者 简历',
                ],
                'file_name' => 'Dio_Prasetyo_CV.pdf',
                'version' => '2026.1',
                'is_active' => true,
                'download_count' => 0,
                'notes' => 'Resume kurikulum vitae resmi Dio Prasetyo (Informatics Engineering Universitas Pancasila, Full Stack Developer)',
            ]
        );
    }
}
