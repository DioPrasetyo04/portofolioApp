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
                'techs' => [
                    ['name' => 'TypeScript', 'proficiency' => 92],
                    ['name' => 'JavaScript', 'proficiency' => 95],
                    ['name' => 'PHP', 'proficiency' => 94],
                    ['name' => 'Python', 'proficiency' => 82],
                    ['name' => 'SQL', 'proficiency' => 88],
                ],
            ],
            [
                'name' => [
                    'en' => 'Frameworks & Libraries',
                    'id' => 'Framework & Pustaka',
                    'zh' => '框架与库',
                ],
                'techs' => [
                    ['name' => 'React.js', 'proficiency' => 95],
                    ['name' => 'Laravel', 'proficiency' => 96],
                    ['name' => 'Three.js / R3F', 'proficiency' => 88],
                    ['name' => 'Next.js', 'proficiency' => 90],
                    ['name' => 'Tailwind CSS', 'proficiency' => 98],
                    ['name' => 'Framer Motion', 'proficiency' => 92],
                ],
            ],
            [
                'name' => [
                    'en' => 'Database & Cloud',
                    'id' => 'Basis Data & Cloud',
                    'zh' => '数据库与云服务',
                ],
                'techs' => [
                    ['name' => 'MySQL', 'proficiency' => 90],
                    ['name' => 'PostgreSQL', 'proficiency' => 85],
                    ['name' => 'Redis', 'proficiency' => 82],
                    ['name' => 'Docker', 'proficiency' => 80],
                    ['name' => 'AWS', 'proficiency' => 78],
                    ['name' => 'Vercel', 'proficiency' => 90],
                ],
            ],
            [
                'name' => [
                    'en' => 'Tools & Architecture',
                    'id' => 'Peralatan & Arsitektur',
                    'zh' => '工具与架构',
                ],
                'techs' => [
                    ['name' => 'Git', 'proficiency' => 95],
                    ['name' => 'Filament CMS', 'proficiency' => 94],
                    ['name' => 'Inertia.js', 'proficiency' => 92],
                    ['name' => 'Vite', 'proficiency' => 90],
                    ['name' => 'REST API / GraphQL', 'proficiency' => 92],
                ],
            ],
        ];

        $techMap = [];

        foreach ($categories as $catData) {
            $cat = TechnologyCategory::firstOrCreate(
                ['name->en' => $catData['name']['en']],
                ['name' => $catData['name']]
            );

            foreach ($catData['techs'] as $techItem) {
                $techName = is_array($techItem) ? $techItem['name'] : $techItem;
                $proficiency = is_array($techItem) ? ($techItem['proficiency'] ?? 85) : 85;

                $tech = Technology::updateOrCreate(
                    ['name' => $techName, 'technology_category_id' => $cat->id],
                    ['proficiency' => $proficiency]
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
                'percentage' => 90,
                'description' => [
                    'en' => 'Professional Working Proficiency (C1/C2) with extensive experience in international cross-functional collaboration and technical writing.',
                    'id' => 'Tingkat Kerja Profesional (C1/C2) dengan pengalaman luas dalam kolaborasi tim lintas fungsi internasional dan penulisan teknis.',
                    'zh' => '专业工作水平 (C1/C2)，具备丰富的跨国团队协作与技术文档撰写经验。',
                ],
                'detail' => [
                    'en' => '<p><strong>English Proficiency Overview:</strong></p><p>Demonstrated ability to communicate effectively in professional engineering environments, deliver technical presentations, write comprehensive system architecture documentation, and conduct code reviews with international distributed teams.</p><ul><li><strong>Certifications:</strong> IELTS Academic Band 7.5 / TOEFL iBT 102</li><li><strong>Core Strengths:</strong> Architectural RFC drafting, cross-border sprint planning, and client-facing technical negotiations.</li><li><strong>Domain Focus:</strong> Full-stack web technologies, Cloud systems, and 3D WebGL computer graphics.</li></ul>',
                    'id' => '<p><strong>Ringkasan Kemahiran Bahasa Inggris:</strong></p><p>Kemampuan komunikasi lancar dalam lingkungan rekayasa perangkat lunak profesional, presentasi teknis tingkat lanjut, penyusunan dokumentasi arsitektur sistem, dan koordinasi tim global lintas negara.</p><ul><li><strong>Sertifikasi:</strong> IELTS Academic Band 7.5 / TOEFL iBT 102</li><li><strong>Keahlian Utama:</strong> Penulisan dokumen RFC arsitektur, perencanaan sprint global, dan negosiasi teknis klien.</li><li><strong>Fokus Bidang:</strong> Teknologi web full-stack, sistem Cloud, dan grafika komputer 3D WebGL.</li></ul>',
                    'zh' => '<p><strong>英语能力概览：</strong></p><p>具备在专业软件工程环境中流畅沟通、进行高阶技术架构演示、撰写详尽系统设计文档及与全球分布式团队协同代码审查的能力。</p><ul><li><strong>官方认证：</strong> 雅思学术类 7.5 分 / 托福 iBT 102 分</li><li><strong>核心优势：</strong> 架构设计 RFC 撰写、跨时区敏捷开发迭代、技术商务谈判。</li><li><strong>专注领域：</strong> 全栈 Web 开发、云计算基础设施及 3D WebGL 计算机图形学。</li></ul>',
                ],
                'gallery' => [],
                'media' => [
                    [
                        'type' => 'image',
                        'file' => null,
                        'url' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Global Team Sprint & Architecture Sync',
                    ],
                    [
                        'type' => 'image',
                        'file' => null,
                        'url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Technical Conference Keynote & Live Demo',
                    ],
                ],
                'video' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'name' => 'Bahasa Indonesia',
                'percentage' => 100,
                'description' => [
                    'en' => 'Native / Mother Tongue with complete command over formal, business, and specialized technical engineering Indonesian.',
                    'id' => 'Penutur Asli / Bahasa Ibu dengan penguasaan menyeluruh dalam ragam formal, bisnis, dan kosakata rekayasa perangkat lunak.',
                    'zh' => '母语使用者，全面精通商务沟通、官方正式语境及软件工程专业技术词汇。',
                ],
                'detail' => [
                    'en' => '<p><strong>Bahasa Indonesia Mastery:</strong></p><p>Native fluency with extensive experience leading Indonesian engineering chapters, mentoring local tech talents, translating complex technical whitepapers, and authoring national tech articles.</p><ul><li><strong>Experience:</strong> 8+ years leading local engineering teams and regional developer community initiatives.</li><li><strong>Strengths:</strong> High-impact technical writing, public speaking at regional conferences, and bilingual curriculum development.</li></ul>',
                    'id' => '<p><strong>Penguasaan Bahasa Indonesia:</strong></p><p>Kefasihan penutur asli dengan pengalaman memimpin divisi rekayasa perangkat lunak, membimbing talenta teknologi, menerjemahkan dokumen teknis berstandar tinggi, dan menulis artikel rekayasa perangkat lunak berskala nasional.</p><ul><li><strong>Pengalaman:</strong> 8+ tahun memimpin tim rekayasa perangkat lunak dan inisiatif komunitas developer.</li><li><strong>Keahlian:</strong> Penulisan teknis mendalam, pembicara seminar teknologi, dan penyusunan modul pembelajaran bilingual.</li></ul>',
                    'zh' => '<p><strong>印尼语母语能力：</strong></p><p>拥有多年印尼本地工程团队领导经验，负责指导本地开发人才、翻译高标准技术白皮书并在全国性技术平台发表专栏文章。</p><ul><li><strong>实践经验：</strong> 8 年以上带领本土技术团队及推动区域开发者社区发展的经验。</li><li><strong>专业特长：</strong> 深度技术写作、技术大会演讲及双语工程培训体系构建。</li></ul>',
                ],
                'gallery' => [],
                'media' => [
                    [
                        'type' => 'image',
                        'file' => null,
                        'url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'National Developer Summit & Tech Community Workshop',
                    ],
                ],
                'video' => null,
            ],
            [
                'name' => 'Mandarin (中文)',
                'percentage' => 75,
                'description' => [
                    'en' => 'Conversational & Technical Vocabulary (HSK 4+) with daily usage in hardware procurement, API integration, and overseas supplier coordination.',
                    'id' => 'Percakapan & Kosakata Teknis (HSK 4+) yang digunakan aktif dalam pengadaan hardware, integrasi API, dan koordinasi pemasok luar negeri.',
                    'zh' => '日常交流与专业技术词汇 (HSK 4+)，熟练应用于硬件采购对接、API系统集成及海外供应链协同。',
                ],
                'detail' => [
                    'en' => '<p><strong>Mandarin Chinese Language Capabilities:</strong></p><p>Capable of navigating technical documentations in Simplified Chinese, conducting conversational discussions with Chinese-speaking engineering partners, and translating developer API guidelines.</p><ul><li><strong>Proficiency Level:</strong> HSK Level 4+ (Conversational & Business Engineering terminology)</li><li><strong>Key Use Cases:</strong> Hardware IoT integration, supplier communication, and Asian regional API spec reviews.</li></ul>',
                    'id' => '<p><strong>Kemampuan Bahasa Mandarin:</strong></p><p>Mampu menelaah dokumentasi teknis dalam aksara Mandarin Sederhana, melakukan diskusi percakapan dengan mitra teknologi berbahasa Mandarin, dan menerjemahkan panduan integrasi API.</p><ul><li><strong>Tingkat Kemahiran:</strong> HSK Level 4+ (Kosakata Percakapan, Bisnis & Rekayasa Perangkat Lunak)</li><li><strong>Aplikasi Kerja:</strong> Integrasi perangkat keras IoT, komunikasi rantai pasok, dan review spesifikasi API regional Asia.</li></ul>',
                    'zh' => '<p><strong>中文能力详述：</strong></p><p>能够熟练阅读简体中文技术文档、与华语技术团队开展工作日常沟通，并负责国际化 API 接口与技术规范的双向对接。</p><ul><li><strong>水平级别：</strong> 具备 HSK 4+ 级日常及商务工程技术沟通能力。</li><li><strong>应用场景：</strong> IoT 智能硬件对接、供应商沟通协调及亚太区 API 规范技术审阅。</li></ul>',
                ],
                'gallery' => [],
                'media' => [
                    [
                        'type' => 'image',
                        'file' => null,
                        'url' => 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Cross-Border Tech Partnership & Supplier Coordination',
                    ],
                ],
                'video' => null,
            ],
        ];

        foreach ($languages as $langData) {
            LanguageSkill::updateOrCreate(
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
                'issuer_icon' => 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
                'issued_at' => '2024-06-15',
                'credential_id' => 'AWS-SAA-2024-78912',
                'url' => 'https://aws.amazon.com/verification',
                'image' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
                ],
                'description' => [
                    'en' => 'Validated expertise in architecting secure, resilient, and high-performance cloud applications on AWS infrastructure.',
                    'id' => 'Validasi keahlian merancang aplikasi cloud yang aman, tangguh, dan berkinerja tinggi pada infrastruktur AWS.',
                    'zh' => '验证了在AWS基础设施上设计安全、弹性且高性能云架构的专业能力。',
                ],
                'detail' => [
                    'en' => '<p><strong>AWS Certified Solutions Architect – Associate (SAA-C03)</strong> validates the ability to design distributed systems and deploy robust applications on AWS cloud infrastructure.</p><h3>Key Exam Domains Mastered:</h3><ul><li><strong>Design Secure Architectures:</strong> IAM policy governance, VPC subnet peering, KMS encryption, and WAF security rules.</li><li><strong>Design Resilient Architectures:</strong> Multi-AZ high availability, Auto Scaling groups, Amazon Aurora global databases, and Route 53 DNS failover.</li><li><strong>Design High-Performing Architectures:</strong> Elastic Load Balancing, CloudFront CDN caching, and serverless architectures with AWS Lambda & SQS.</li><li><strong>Design Cost-Optimized Architectures:</strong> S3 Intelligent-Tiering, EC2 Spot instances, and AWS Savings Plans.</li></ul>',
                    'id' => '<p><strong>AWS Certified Solutions Architect – Associate (SAA-C03)</strong> memvalidasi kemampuan dalam merancang sistem terdistribusi dan menerapkan aplikasi tangguh pada infrastruktur cloud AWS.</p><h3>Domain Ujian Utama yang Dikuasai:</h3><ul><li><strong>Perancangan Arsitektur Aman:</strong> Tata kelola IAM, VPC subnetting & peering, enkripsi data KMS, dan proteksi AWS WAF.</li><li><strong>Arsitektur Tangguh & Tahan Bencana:</strong> Multi-AZ High Availability, Auto Scaling, database global Amazon Aurora, dan failover Route 53.</li><li><strong>Arsitektur Berkinerja Tinggi:</strong> Elastic Load Balancing, CloudFront CDN, dan komputasi serverless AWS Lambda & SQS.</li><li><strong>Optimalisasi Biaya:</strong> S3 Intelligent-Tiering dan alokasi instans hemat biaya.</li></ul>',
                    'zh' => '<p><strong>AWS认证解决方案架构师 – 助理级 (SAA-C03)</strong> 证明了在AWS云平台上构建高可用、高安全性与弹性可伸缩分布式系统的综合能力。</p><h3>掌握的核心考核领域：</h3><ul><li><strong>安全架构设计：</strong> IAM精细化权限管控、VPC网络拓扑、KMS数据加密及WAF安全防护。</li><li><strong>高可用架构设计：</strong> 跨可用区(Multi-AZ)容灾部署、自动伸缩组、Amazon Aurora分布式数据库。</li><li><strong>高性能系统设计：</strong> Elastic Load Balancing负载均衡、CloudFront CDN全网加速与Serverless无服务器架构。</li><li><strong>成本效益优化：</strong> S3分级存储策略及云上资源成本分析优化。</li></ul>',
                ],
            ],
            [
                'name' => [
                    'en' => 'Meta Full-Stack Professional Certificate',
                    'id' => 'Sertifikat Profesional Full-Stack Meta',
                    'zh' => 'Meta全栈开发专业证书',
                ],
                'issuer' => 'Meta & Coursera',
                'issuer_icon' => 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
                'issued_at' => '2023-11-20',
                'credential_id' => 'META-FS-99201-CERT',
                'url' => 'https://coursera.org/verify/meta',
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                ],
                'description' => [
                    'en' => 'Comprehensive master certificate covering React, Django, database modeling, REST APIs, and UI/UX design principles.',
                    'id' => 'Sertifikat komprehensif yang mencakup React, basis data, REST API, dan prinsip-prinsip desain UI/UX.',
                    'zh' => '涵盖React、数据库建模、REST API以及UI/UX设计原则的综合专业证书。',
                ],
                'detail' => [
                    'en' => '<p>The <strong>Meta Full-Stack Professional Certificate</strong> is an intensive curriculum developed by senior Meta engineers to validate end-to-end full-stack software development expertise.</p><h3>Program Highlights:</h3><ul><li><strong>Front-End Engineering:</strong> Advanced React state management, hooks architecture, and responsive UX design.</li><li><strong>Back-End Development:</strong> Django REST Framework, database schemas, object-relational mapping (ORM), and authentication protocols.</li><li><strong>DevOps & Deployment:</strong> CI/CD workflows, automated testing with Jest and PyTest, and containerization.</li><li><strong>Capstone Project:</strong> Built a production-ready web application adhering to enterprise software patterns.</li></ul>',
                    'id' => '<p><strong>Meta Full-Stack Professional Certificate</strong> adalah program kurikulum intensif yang dikembangkan oleh insinyur senior Meta untuk memvalidasi keahlian pengembangan aplikasi full-stack end-to-end.</p><h3>Materi & Kompetensi:</h3><ul><li><strong>Rekayasa Frontend:</strong> React state management modern, arsitektur hooks, dan desain antarmuka responsif.</li><li><strong>Pengembangan Backend:</strong> Django REST Framework, pemodelan basis data relasional, dan protokol autentikasi aman.</li><li><strong>Pengujian & Deployment:</strong> Alur CI/CD, pengujian otomatis menggunakan Jest dan PyTest.</li><li><strong>Proyek Capstone:</strong> Merancang dan mendeploy aplikasi berskala produksi dengan arsitektur modern.</li></ul>',
                    'zh' => '<p><strong>Meta全栈开发专业证书</strong> 由Meta资深工程师团队设计，全面评估端到端现代化Web全栈开发能力。</p><h3>核心课程与实战要点：</h3><ul><li><strong>前端核心工程：</strong> React深度状态管理、Hooks设计模式与响应式用户体验设计。</li><li><strong>后端架构开发：</strong> Django REST Framework、关系型数据库设计、ORM及API安全认证机制。</li><li><strong>测试与自动化部署：</strong> CI/CD流水线构建、Jest与PyTest自动化单元测试。</li><li><strong>毕业大项目实战：</strong> 独立完成企业级全栈产品架构设计与云端部署。</li></ul>',
                ],
            ],
            [
                'name' => [
                    'en' => 'Three.js Journey — 3D Web Creative Development',
                    'id' => 'Three.js Journey — Pengembangan Kreatif Web 3D',
                    'zh' => 'Three.js Journey — 3D创意网页开发',
                ],
                'issuer' => 'Bruno Simon',
                'issuer_icon' => 'https://threejs-journey.com/assets/favicon/favicon-32x32.png',
                'issued_at' => '2024-02-10',
                'credential_id' => '3JS-JOURNEY-BS-44120',
                'url' => 'https://threejs-journey.com',
                'image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
                ],
                'description' => [
                    'en' => 'Advanced shader programming (GLSL), physics integration with Rapier, post-processing, and React Three Fiber mastery.',
                    'id' => 'Pemrograman shader lanjutan (GLSL), integrasi fisika dengan Rapier, post-processing, dan penguasaan React Three Fiber.',
                    'zh' => '掌握高级着色器编程(GLSL)、Rapier物理引擎集成、后期处理与React Three Fiber开发。',
                ],
                'detail' => [
                    'en' => '<p><strong>Three.js Journey</strong> is the premier accreditation program for WebGL 3D graphics created by Bruno Simon.</p><h3>Mastered Technical Domains:</h3><ul><li><strong>WebGL & WebGPU Foundations:</strong> Custom vertex and fragment shaders written in GLSL.</li><li><strong>Real-Time Physics:</strong> Physics simulations using Rapier and Cannon.js with multi-body collision detection.</li><li><strong>React Three Fiber & Drei:</strong> Declarative 3D scene composition, interactive canvas controls, and GLTF asset optimization.</li><li><strong>Shaders & VFX:</strong> Perlin noise procedural landscapes, water wave shaders, particle systems, and bloom post-processing passes.</li></ul>',
                    'id' => '<p><strong>Three.js Journey</strong> adalah program akreditasi grafika WebGL 3D terkemuka yang dirancang oleh kreator 3D ternama Bruno Simon.</p><h3>Domain Teknis yang Dikuasai:</h3><ul><li><strong>Dasar WebGL & Shader:</strong> Pembuatan custom vertex dan fragment shader berbasis GLSL.</li><li><strong>Fisika Real-Time:</strong> Simulasi fisika dengan Rapier & Cannon.js dengan deteksi tabrakan presisi.</li><li><strong>React Three Fiber & Drei:</strong> Komposisi scene 3D deklaratif, kontrol kamera interaktif, dan optimasi aset 3D GLTF.</li><li><strong>Efek Visual (VFX):</strong> Procedural landscape shader, simulasi air dinamis, sistem partikel, dan efek post-processing bloom.</li></ul>',
                    'zh' => '<p><strong>Three.js Journey</strong> 是由国际著名3D Web开发专家Bruno Simon打造的权威WebGL与三维图形学认证课程。</p><h3>掌握的核心图形技术：</h3><ul><li><strong>WebGL与GLSL基础：</strong> 自定义顶点着色器(Vertex)与片元着色器(Fragment)编写。</li><li><strong>实时物理引擎：</strong> 使用Rapier与Cannon.js进行高精度刚体物理与碰撞模拟。</li><li><strong>React Three Fiber生态：</strong> 声明式3D场景组织、交互式控制器与GLTF模型深度优化。</li><li><strong>高级着色器特效：</strong> 柏林噪声地形生成、流体水面模拟、粒子星系系统及Bloom后期辉光效果。</li></ul>',
                ],
            ],
            [
                'name' => [
                    'en' => 'Google Cloud Certified Professional Cloud Architect',
                    'id' => 'Google Cloud Certified Arsitek Cloud Profesional',
                    'zh' => '谷歌云认证专业级云架构师',
                ],
                'issuer' => 'Google Cloud Platform',
                'issuer_icon' => 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
                'issued_at' => '2024-04-18',
                'credential_id' => 'GCP-PCA-98302-VALID',
                'url' => 'https://cloud.google.com/certification/cloud-architect',
                'image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
                ],
                'description' => [
                    'en' => 'Authoritative certification validating enterprise cloud infrastructure, Kubernetes engine orchestration, and BigQuery data pipelines.',
                    'id' => 'Sertifikasi otoritatif yang memvalidasi infrastruktur cloud enterprise, orkestrasi Kubernetes, dan pipeline data BigQuery.',
                    'zh' => '权威认证，验证了企业级云基础设施架构设计、Kubernetes容器编排及BigQuery数据处理管道的实战能力。',
                ],
                'detail' => [
                    'en' => '<p>The <strong>Google Cloud Professional Cloud Architect</strong> credential represents the pinnacle of cloud design and implementation excellence.</p><h3>Core Technical Competencies:</h3><ul><li><strong>Compute Engine & GKE:</strong> Google Kubernetes Engine multi-cluster management and auto-scaling workload orchestration.</li><li><strong>Security & Compliance:</strong> Cloud IAM, VPC Service Controls, Cloud Armor DDoS prevention, and zero-trust BeyondCorp architecture.</li><li><strong>Data & Analytics:</strong> BigQuery analytics warehousing, Cloud Pub/Sub real-time streaming, and Cloud Storage lifecycle management.</li><li><strong>Observability:</strong> Cloud Monitoring, Cloud Logging, and OpenTelemetry distributed tracing.</li></ul>',
                    'id' => '<p><strong>Google Cloud Professional Cloud Architect</strong> adalah sertifikasi standar industri tertinggi untuk perancangan dan implementasi solusi cloud Google.</p><h3>Kompetensi Teknis Utama:</h3><ul><li><strong>Komputasi & GKE:</strong> Google Kubernetes Engine, manajemen multi-cluster, dan orkestrasi workload otomatis.</li><li><strong>Keamanan & Kepatuhan:</strong> Cloud IAM, VPC Service Controls, proteksi Cloud Armor, dan model keamanan Zero-Trust.</li><li><strong>Data & Analitik:</strong> BigQuery data warehouse, streaming data Cloud Pub/Sub, dan tata kelola Cloud Storage.</li><li><strong>Observabilitas:</strong> Cloud Monitoring, Cloud Logging, dan tracing terdistribusi OpenTelemetry.</li></ul>',
                    'zh' => '<p><strong>谷歌云专业级云架构师认证 (PCA)</strong> 代表了在Google Cloud平台上设计、开发与管理可扩展企业级解决方案的最高行业标准。</p><h3>核心专业能力：</h3><ul><li><strong>计算引擎与GKE编排：</strong> Google Kubernetes Engine跨集群容灾管理与工作负载弹性调度。</li><li><strong>安全与合规保障：</strong> Cloud IAM权限隔离、VPC服务控制区、Cloud Armor防护与Zero-Trust安全模型。</li><li><strong>大数据流式处理：</strong> BigQuery分布式分析数仓、Cloud Pub/Sub毫秒级消息流处理。</li><li><strong>全面可观测性：</strong> Cloud Monitoring监控告警体系、Cloud Logging与OpenTelemetry全链路追踪。</li></ul>',
                ],
            ],
            [
                'name' => [
                    'en' => 'Certified Kubernetes Administrator (CKA)',
                    'id' => 'Administrator Kubernetes Tersertifikasi (CKA)',
                    'zh' => '官方认证Kubernetes管理员 (CKA)',
                ],
                'issuer' => 'Cloud Native Computing Foundation (CNCF)',
                'issuer_icon' => 'https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg',
                'issued_at' => '2023-09-12',
                'credential_id' => 'CKA-CNCF-2309-8472',
                'url' => 'https://www.cncf.io/certification/cka/',
                'image' => 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80',
                ],
                'description' => [
                    'en' => 'Rigorous performance-based certification on Kubernetes cluster architecture, networking, security policies, and production troubleshooting.',
                    'id' => 'Sertifikasi berbasis ujian praktik ketat untuk arsitektur klaster Kubernetes, networking CNI, kebijakan keamanan, dan troubleshooting.',
                    'zh' => '通过严苛的实操上机考核，验证Kubernetes集群架构部署、CNI网络、安全策略配置及线上故障排查能力。',
                ],
                'detail' => [
                    'en' => '<p>The <strong>Certified Kubernetes Administrator (CKA)</strong> program was created by the Linux Foundation and the Cloud Native Computing Foundation (CNCF) to demonstrate real-world proficiency in orchestrating containerized microservices.</p><h3>Tested Domains & Skills:</h3><ul><li><strong>Cluster Architecture & Installation:</strong> kubeadm multi-node bootstrapping, etcd distributed backup/restore, and control plane upgrades.</li><li><strong>Workloads & Scheduling:</strong> Deployments, StatefulSets, DaemonSets, affinities, taints & tolerations.</li><li><strong>Services & Networking:</strong> Ingress controllers, CoreDNS debugging, NetworkPolicies, and CNI plugins (Calico/Cilium).</li><li><strong>Storage:</strong> PersistentVolumes, StorageClasses, dynamic volume provisioning, and CSI integration.</li><li><strong>Troubleshooting:</strong> Worker node failure remediation, container crash diagnostic, and kubelet log analysis.</li></ul>',
                    'id' => '<p><strong>Certified Kubernetes Administrator (CKA)</strong> adalah sertifikasi resmi dari Linux Foundation dan CNCF yang membuktikan kemampuan langsung dalam mengorkestrasi microservices dalam container.</p><h3>Materi & Domain Praktik:</h3><ul><li><strong>Arsitektur Klaster & Instalasi:</strong> Bootstrap kubeadm multi-node, backup/restore database etcd, dan upgrade control plane.</li><li><strong>Workloads & Penjadwalan:</strong> Deployments, StatefulSets, DaemonSets, node affinity, dan tolerations.</li><li><strong>Jaringan & Service:</strong> Ingress controller, konfigurasi CoreDNS, NetworkPolicy, dan CNI plugin (Calico/Cilium).</li><li><strong>Penyimpanan:</strong> PersistentVolume, StorageClass, dan integrasi CSI.</li><li><strong>Troubleshooting Produksi:</strong> Penanganan kegagalan node, diagnosa container crash, dan analisis log kubelet.</li></ul>',
                    'zh' => '<p><strong>CKA (Certified Kubernetes Administrator)</strong> 是由Linux基金会与CNCF联合推出的权威实操认证，证明了管理生产级大规模容器化微服务集群的顶尖技术能力。</p><h3>实操核心技能考核：</h3><ul><li><strong>集群架构与部署：</strong> kubeadm多主节点引导、etcd数据库高可用备份与还原、控制平面平滑升级。</li><li><strong>工作负载调度策略：</strong> Deployments、StatefulSets、DaemonSets、节点亲和性及污点容忍(Taints/Tolerations)。</li><li><strong>服务发现与网络：</strong> Ingress路由控制器、CoreDNS解析优化、NetworkPolicies隔离与CNI插件配置。</li><li><strong>存储持久化：</strong> PersistentVolumes、StorageClasses动态存储卷分配及CSI驱动集成。</li><li><strong>生产故障排查：</strong> 节点异常修复、容器崩溃快速诊断与kubelet日志深入分析。</li></ul>',
                ],
            ],
            [
                'name' => [
                    'en' => 'Docker Certified Associate (DCA)',
                    'id' => 'Associate Docker Tersertifikasi (DCA)',
                    'zh' => 'Docker官方认证工程师 (DCA)',
                ],
                'issuer' => 'Docker Inc. & Mirantis',
                'issuer_icon' => 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg',
                'issued_at' => '2023-05-10',
                'credential_id' => 'DCA-ENG-2023-5591',
                'url' => 'https://www.docker.com',
                'image' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
                ],
                'description' => [
                    'en' => 'Industry-standard accreditation in container virtualization, multi-stage Dockerfile optimization, and secure container registries.',
                    'id' => 'Akreditasi standar industri dalam virtualisasi kontainer, optimasi Dockerfile multi-stage, dan keamanan registri kontainer.',
                    'zh' => '容器虚拟化技术、多阶段Dockerfile构建优化及企业级镜像安全管理的权威行业标准认证。',
                ],
                'detail' => [
                    'en' => '<p>The <strong>Docker Certified Associate (DCA)</strong> credential validates mastery of foundational and advanced containerization technologies.</p><h3>Key Domains Covered:</h3><ul><li><strong>Orchestration:</strong> Docker Swarm mode cluster initialization, service scaling, and rolling updates.</li><li><strong>Image Creation & Management:</strong> Multi-stage builds, layer caching optimization, and minimal distroless base images.</li><li><strong>Installation & Configuration:</strong> Docker Engine daemon tuning, logging drivers, and storage overlay2 configurations.</li><li><strong>Security:</strong> Docker Content Trust (DCT), secret management, mutual TLS node communication, and rootless containers.</li></ul>',
                    'id' => '<p><strong>Docker Certified Associate (DCA)</strong> memvalidasi penguasaan teknologi kontainerisasi mulai dari level dasar hingga enterprise.</p><h3>Cakupan Kompetensi:</h3><ul><li><strong>Orkestrasi:</strong> Inisialisasi cluster Docker Swarm, penskalaan service, dan rolling updates tanpa downtime.</li><li><strong>Pembuatan & Optimasi Image:</strong> Multi-stage builds, optimalisasi layer cache, dan penggunaan base image minimalis.</li><li><strong>Konfigurasi Engine:</strong> Penyetelan Docker daemon, logging driver, dan driver penyimpanan overlay2.</li><li><strong>Keamanan Kontainer:</strong> Docker Content Trust, secret management terenkripsi, dan mode rootless.</li></ul>',
                    'zh' => '<p><strong>Docker官方认证工程师 (DCA)</strong> 验证了在企业生产环境中设计、构建及维护容器化基础设施的权威能力。</p><h3>核心技术考核内容：</h3><ul><li><strong>容器编排与集群管理：</strong> Docker Swarm集群构建、服务高可用扩缩容与零停机滚动更新。</li><li><strong>镜像构建与深度优化：</strong> 多阶段构建(Multi-stage builds)、镜像分层缓存加速与超轻量Distroless基础镜像选型。</li><li><strong>引擎配置与存储驱动：</strong> Docker Daemon高性能参数调优、日志驱动集成与overlay2存储驱动优化。</li><li><strong>企业级安全防护：</strong> Docker Content Trust镜像数字签名、加密Secrets管理及Rootless非特权运行模式。</li></ul>',
                ],
            ],
        ];

        foreach ($certificates as $certData) {
            Certificate::updateOrCreate(
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
