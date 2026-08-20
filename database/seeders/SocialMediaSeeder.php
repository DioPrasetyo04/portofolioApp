<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SocialMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialMedias = [
            [
                'name' => 'WhatsApp',
                'url' => 'https://wa.me/1234567890',
                'icon' => 'bi-whatsapp',
                'is_active' => true,
            ],
            [
                'name' => 'Instagram',
                'url' => 'https://instagram.com/yourusername',
                'icon' => 'bi-instagram',
                'is_active' => true,
            ],
            [
                'name' => 'Twitter',
                'url' => 'https://twitter.com/yourusername',
                'icon' => 'bi-twitter-x',
                'is_active' => true,
            ],
            [
                'name' => 'LinkedIn',
                'url' => 'https://linkedin.com/in/yourusername',
                'icon' => 'bi-linkedin',
                'is_active' => true,
            ],
            [
                'name' => 'GitHub',
                'url' => 'https://github.com/yourusername',
                'icon' => 'bi-github',
                'is_active' => true,
            ],
        ];

        foreach ($socialMedias as $sm) {
            \App\Models\SocialMedia::create($sm);
        }
    }
}
