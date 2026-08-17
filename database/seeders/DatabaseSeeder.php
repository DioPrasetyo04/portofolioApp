<?php

namespace Database\Seeders;

use App\Models\AboutMe;
use App\Models\Announcement;
use App\Models\Certificate;
use App\Models\HeroSection;
use App\Models\LanguageSkill;
use App\Models\News;
use App\Models\Project;
use App\Models\Technology;
use App\Models\TechnologyCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Admin User
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Portfolio',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Hero Section
        if (HeroSection::count() === 0) {
            HeroSection::create([
                'title' => [
                    'en' => 'Building Next-Gen 3D Web & Fullstack Experiences',
                    'id' => 'Membangun Pengalaman Web 3D & Fullstack Generasi Terbaru',
                    'zh' => '构建下一代3D网页与全栈开发体验',
                ],
                'subtitle' => [
                    'en' => 'Passionate Software Engineer specializing in modern reactive architectures, Three.js 3D visuals, and high-performance web systems.',
                    'id' => 'Software Engineer berpengalaman yang berfokus pada arsitektur reaktif modern, visual 3D Three.js, dan sistem web berkinerja tinggi.',
                    'zh' => '专注于现代响应式架构、Three.js 3D视觉效果与高性能Web系统的软件工程师。',
                ],
                'image' => null,
            ]);
        }

        // 3. About Me
        if (AboutMe::count() === 0) {
            AboutMe::create([
                'projects_completed' => 24,
                'certifications' => 12,
                'years_experience' => 4,
                'description' => [
                    'en' => '<p>Hello! I am a full-stack engineer and creative technologist who loves crafting immersive interactive experiences. With a strong background in Laravel, React, and 3D graphics, I bridge the gap between aesthetic design and robust engineering.</p>',
                    'id' => '<p>Halo! Saya adalah seorang full-stack engineer dan creative technologist yang gemar menciptakan pengalaman interaktif visual. Berbekal keahlian di Laravel, React, dan grafis 3D, saya menghubungkan desain estetis dengan rekayasa sistem yang handal.</p>',
                    'zh' => '<p>你好！我是一名全栈工程师和创意技术专家，热衷于打造身临其境的交互体验。凭借在Laravel、React和3D图形方面的扎实功底，我将美学设计与稳健工程完美结合。</p>',
                ],
            ]);
        }

        // 4. Technology Categories & Technologies
        $categories = [
            [
                'name' => [
                    'en' => 'Languages',
                    'id' => 'Bahasa Pemrograman',
                    'zh' => '编程语言',
                ],
                'techs' => ['TypeScript', 'JavaScript', 'PHP', 'Python', 'SQL'],
            ],
            [
                'name' => [
                    'en' => 'Frameworks & Libraries',
                    'id' => 'Framework & Pustaka',
                    'zh' => '框架与库',
                ],
                'techs' => ['React.js', 'Laravel', 'Three.js / R3F', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
            ],
            [
                'name' => [
                    'en' => 'Database & Cloud',
                    'id' => 'Basis Data & Cloud',
                    'zh' => '数据库与云服务',
                ],
                'techs' => ['MySQL', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Vercel'],
            ],
            [
                'name' => [
                    'en' => 'Tools & Architecture',
                    'id' => 'Peralatan & Arsitektur',
                    'zh' => '工具与架构',
                ],
                'techs' => ['Git', 'Filament CMS', 'Inertia.js', 'Vite', 'REST API / GraphQL'],
            ],
        ];

        $techMap = [];

        foreach ($categories as $catData) {
            $cat = TechnologyCategory::firstOrCreate(
                ['name->en' => $catData['name']['en']],
                ['name' => $catData['name']]
            );

            foreach ($catData['techs'] as $techName) {
                $tech = Technology::firstOrCreate(
                    ['name' => $techName, 'technology_category_id' => $cat->id],
                    ['logo' => null]
                );
                $techMap[$techName] = $tech->id;
            }
        }

        // 5. Projects
        $projects = [
            [
                'name' => [
                    'en' => '3D Interactive Portfolio Platform',
                    'id' => 'Platform Portofolio Interaktif 3D',
                    'zh' => '3D交互式作品集平台',
                ],
                'description' => [
                    'en' => 'Personal portfolio featuring real-time 3D canvas, multi-language switching, dark/light theme, and dynamic Filament CMS.',
                    'id' => 'Portofolio personal dengan kanvas 3D real-time, pengalih multi-bahasa, tema gelap/terang, dan CMS Filament yang dinamis.',
                    'zh' => '具有实时3D画布、多语言切换、暗黑/明亮主题和动态Filament CMS的个人作品集。',
                ],
                'demo_url' => 'https://example.com',
                'repo_url' => 'https://github.com/example/portfolio-3d',
                'is_featured' => true,
                'techs' => ['Laravel', 'React.js', 'Three.js / R3F', 'TypeScript', 'Tailwind CSS'],
            ],
            [
                'name' => [
                    'en' => 'Enterprise E-Commerce & Analytics Dashboard',
                    'id' => 'Dashboard E-Commerce & Analitik Enterprise',
                    'zh' => '企业级电子商务与分析仪表盘',
                ],
                'description' => [
                    'en' => 'Full-featured enterprise SaaS store with real-time financial reporting, inventory tracking, and payment gateways.',
                    'id' => 'Aplikasi SaaS toko enterprise dengan pelaporan keuangan real-time, pelacakan inventaris, dan gateway pembayaran.',
                    'zh' => '功能完备的企业级SaaS商城，具备实时财务报表、库存跟踪与支付网关。',
                ],
                'demo_url' => 'https://example.com/demo-ecommerce',
                'repo_url' => 'https://github.com/example/enterprise-shop',
                'is_featured' => true,
                'techs' => ['Laravel', 'React.js', 'MySQL', 'Redis', 'Tailwind CSS'],
            ],
            [
                'name' => [
                    'en' => 'AI Vibe Code Assistant & IDE Plugin',
                    'id' => 'Asisten AI Vibe Coding & Plugin IDE',
                    'zh' => 'AI编程助手与IDE插件',
                ],
                'description' => [
                    'en' => 'Developer productivity tool with smart context parsing, prompt template generation, and real-time diff previews.',
                    'id' => 'Alat produktivitas pengembang dengan parsing konteks cerdas, pembuatan template prompt, dan pratinjau diff real-time.',
                    'zh' => '具备智能上下文解析、Prompt模板生成及实时差异预览的开发者生产力工具。',
                ],
                'demo_url' => 'https://example.com/ai-tool',
                'repo_url' => 'https://github.com/example/ai-vibe-tools',
                'is_featured' => true,
                'techs' => ['TypeScript', 'Python', 'React.js', 'Docker'],
            ],
            [
                'name' => [
                    'en' => 'Real-Time Multiplayer 3D Space Game',
                    'id' => 'Game Luar Angkasa 3D Multiplayer Real-Time',
                    'zh' => '实时多人3D太空游戏',
                ],
                'description' => [
                    'en' => 'Browser-based multiplayer WebGL exploration game with physics simulation and spatial audio.',
                    'id' => 'Game eksplorasi WebGL multiplayer berbasis peramban dengan simulasi fisika dan audio spasial.',
                    'zh' => '基于浏览器的多人WebGL太空探索游戏，具有物理模拟与空间音频。',
                ],
                'demo_url' => 'https://example.com/space-game',
                'repo_url' => 'https://github.com/example/webgl-space',
                'is_featured' => false,
                'techs' => ['Three.js / R3F', 'TypeScript', 'Redis'],
            ],
        ];

        foreach ($projects as $projData) {
            $techNames = $projData['techs'];
            unset($projData['techs']);

            $project = Project::firstOrCreate(
                ['name->en' => $projData['name']['en']],
                $projData
            );

            $ids = [];
            foreach ($techNames as $tn) {
                if (isset($techMap[$tn])) {
                    $ids[] = $techMap[$tn];
                }
            }
            if (!empty($ids)) {
                $project->technologies()->sync($ids);
            }
        }

        // 6. Language Skills
        $languages = [
            [
                'name' => 'English',
                'description' => [
                    'en' => 'Professional Working Proficiency (C1/C2)',
                    'id' => 'Tingkat Kerja Profesional (C1/C2)',
                    'zh' => '专业工作水平 (C1/C2)',
                ],
            ],
            [
                'name' => 'Bahasa Indonesia',
                'description' => [
                    'en' => 'Native / Mother Tongue',
                    'id' => 'Penutur Asli / Bahasa Ibu',
                    'zh' => '母语',
                ],
            ],
            [
                'name' => 'Mandarin (中文)',
                'description' => [
                    'en' => 'Conversational & Technical Vocabulary (HSK 4+)',
                    'id' => 'Percakapan & Kosakata Teknis (HSK 4+)',
                    'zh' => '日常交流与专业技术词汇 (HSK 4+)',
                ],
            ],
        ];

        foreach ($languages as $langData) {
            LanguageSkill::firstOrCreate(
                ['name' => $langData['name']],
                $langData
            );
        }

        // 7. Certificates
        $certificates = [
            [
                'name' => [
                    'en' => 'AWS Certified Solutions Architect – Associate',
                    'id' => 'Sertifikasi Arsitek Solusi AWS – Associate',
                    'zh' => 'AWS认证解决方案架构师 – 助理级',
                ],
                'issuer' => 'Amazon Web Services',
                'issued_at' => '2024-06-15',
                'url' => 'https://aws.amazon.com/verification',
                'description' => [
                    'en' => 'Validated expertise in architecting secure, resilient, and high-performance cloud applications on AWS infrastructure.',
                    'id' => 'Validasi keahlian merancang aplikasi cloud yang aman, tangguh, dan berkinerja tinggi pada infrastruktur AWS.',
                    'zh' => '验证了在AWS基础设施上设计安全、弹性且高性能云架构的专业能力。',
                ],
            ],
            [
                'name' => [
                    'en' => 'Meta Full-Stack Professional Certificate',
                    'id' => 'Sertifikat Profesional Full-Stack Meta',
                    'zh' => 'Meta全栈开发专业证书',
                ],
                'issuer' => 'Meta & Coursera',
                'issued_at' => '2023-11-20',
                'url' => 'https://coursera.org/verify/meta',
                'description' => [
                    'en' => 'Comprehensive master certificate covering React, Django, database modeling, REST APIs, and UI/UX design principles.',
                    'id' => 'Sertifikat komprehensif yang mencakup React, basis data, REST API, dan prinsip-prinsip desain UI/UX.',
                    'zh' => '涵盖React、数据库建模、REST API以及UI/UX设计原则的综合专业证书。',
                ],
            ],
            [
                'name' => [
                    'en' => 'Three.js Journey — 3D Web Creative Development',
                    'id' => 'Three.js Journey — Pengembangan Kreatif Web 3D',
                    'zh' => 'Three.js Journey — 3D创意网页开发',
                ],
                'issuer' => 'Bruno Simon',
                'issued_at' => '2024-02-10',
                'url' => 'https://threejs-journey.com',
                'description' => [
                    'en' => 'Advanced shader programming (GLSL), physics integration with Rapier, post-processing, and React Three Fiber mastery.',
                    'id' => 'Pemrograman shader lanjutan (GLSL), integrasi fisika dengan Rapier, post-processing, dan penguasaan React Three Fiber.',
                    'zh' => '掌握高级着色器编程(GLSL)、Rapier物理引擎集成、后期处理与React Three Fiber开发。',
                ],
            ],
        ];

        foreach ($certificates as $certData) {
            Certificate::firstOrCreate(
                ['name->en' => $certData['name']['en']],
                $certData
            );
        }

        // 8. News Articles
        $newsItems = [
            [
                'title' => [
                    'en' => 'How 3D and WebGL are Revolutionizing Modern Portfolios',
                    'id' => 'Bagaimana 3D dan WebGL Merevolusi Portofolio Modern',
                    'zh' => '3D与WebGL技术如何重塑现代个人作品集',
                ],
                'slug' => 'how-3d-and-webgl-are-revolutionizing-modern-portfolios',
                'short_description' => [
                    'en' => 'A deep dive into integrating React Three Fiber and shaders to elevate developer personal branding.',
                    'id' => 'Ulasan mendalam mengenai integrasi React Three Fiber dan shader untuk meningkatkan branding personal pengembang.',
                    'zh' => '深入探讨如何通过集成React Three Fiber与着色器来提升开发者个人品牌。',
                ],
                'detail_content' => [
                    'en' => '<h2>The Shift Towards Immersive Web Experiences</h2><p>Static portfolios are great, but in a crowded tech landscape, interactivity and visual storytelling leave an indelible impression. With modern frameworks like React Three Fiber and @react-three/drei, creating lightweight 3D canvases is now more accessible than ever.</p><h3>Key Takeaways</h3><ul><li>Optimizing 3D assets with Draco compression</li><li>Creating smooth scroll-linked camera animations</li><li>Ensuring accessible fallback layouts for lower-end devices</li></ul>',
                    'id' => '<h2>Pergeseran Menuju Pengalaman Web yang Imersif</h2><p>Portofolio statis sudah bagus, namun dalam persaingan dunia teknologi saat ini, interaktivitas dan visual yang menarik memberikan impresi yang mendalam. Dengan framework modern seperti React Three Fiber dan @react-three/drei, pembuatan kanvas 3D yang ringan kini jauh lebih mudah.</p>',
                    'zh' => '<h2>迈向沉浸式Web体验的演进</h2><p>静态作品集固然实用，但在如今竞争激烈的技术领域，交互性与视觉表现力能够留下深刻印象。借助React Three Fiber等现代工具，打造高性能3D画布变得前所未有的轻松。</p>',
                ],
            ],
            [
                'title' => [
                    'en' => 'Clean Architecture in Laravel 11/13: Repository & Service Patterns',
                    'id' => 'Clean Architecture di Laravel: Pola Repository & Service',
                    'zh' => 'Laravel中的整洁架构：仓储与服务模式实战',
                ],
                'slug' => 'clean-architecture-laravel-repository-service-patterns',
                'short_description' => [
                    'en' => 'Decoupling business logic from controllers for maintainable, testable, and robust enterprise applications.',
                    'id' => 'Memisahkan business logic dari controller untuk aplikasi enterprise yang mudah diuji dan dikelola.',
                    'zh' => '将业务逻辑从控制器中解耦，构建易于维护、测试的高质量企业应用。',
                ],
                'detail_content' => [
                    'en' => '<h2>Why Clean Architecture Matters</h2><p>As applications scale, fat controllers become a bottleneck. By introducing dedicated Service Interfaces and Repository Contracts, we ensure modularity and seamless testability across all domain boundaries.</p>',
                    'id' => '<h2>Mengapa Clean Architecture Penting</h2><p>Seiring aplikasi berkembang, controller yang gemuk menjadi masalah. Dengan menerapkan Service Interface dan Repository Contract, kita memastikan modularitas dan kemudahan testing di semua layer.</p>',
                    'zh' => '<h2>为何整洁架构至关重要</h2><p>随着系统规模扩大，臃肿的控制器将成为维护瓶颈。通过引入独立的服务接口与仓储契约，能够保障跨领域的高内聚与可测试性。</p>',
                ],
            ],
        ];

        foreach ($newsItems as $newsData) {
            News::firstOrCreate(
                ['slug' => $newsData['slug']],
                $newsData
            );
        }

        // 9. Announcements
        if (Announcement::count() === 0) {
            Announcement::create([
                'title' => [
                    'en' => '🚀 Welcome to my new 3D Interactive Portfolio!',
                    'id' => '🚀 Selamat datang di Portofolio Interaktif 3D Terbaru Saya!',
                    'zh' => '🚀 欢迎来到我的全新3D交互式个人作品集！',
                ],
                'description' => [
                    'en' => '<p>Feel free to explore the interactive 3D elements, switch languages (EN/ID/ZH), and try the dark/light mode toggle. I am currently open for full-time roles and freelance collaborations!</p>',
                    'id' => '<p>Silakan jelajahi elemen 3D interaktif, ganti bahasa (EN/ID/ZH), dan coba toggle mode gelap/terang. Saat ini saya terbuka untuk peluang kerja full-time maupun kolaborasi proyek freelance!</p>',
                    'zh' => '<p>欢迎体验可交互的3D视觉效果、切换多语言（中/英/印尼）并尝试暗黑/明亮主题。目前开放全职岗位与自由职业项目合作！</p>',
                ],
                'start_time' => now()->subDay(),
                'end_time' => now()->addMonths(6),
                'image' => null,
            ]);
        }
    }
}
