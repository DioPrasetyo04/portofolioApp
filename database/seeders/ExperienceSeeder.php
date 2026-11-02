<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Experience::count() > 0) {
            return;
        }

        $experiences = [
            // ── Work Experiences ──
            [
                'type' => 'work',
                'role' => [
                    'en' => 'Internship Full-Stack Developer',
                    'id' => 'Internship Full-Stack Developer',
                    'zh' => '全栈开发实习生 (Internship Full-Stack)',
                ],
                'company' => [
                    'en' => 'PT. Indotech Energi Persada',
                    'id' => 'PT. Indotech Energi Persada',
                    'zh' => 'PT. Indotech Energi Persada',
                ],
                'location' => [
                    'en' => 'Jakarta, ID',
                    'id' => 'Jakarta, ID',
                    'zh' => '雅加达，印尼',
                ],
                'period' => [
                    'en' => 'Mar 2025 - Jun 2025',
                    'id' => 'Mar 2025 - Jun 2025',
                    'zh' => '2025年3月 - 2025年6月',
                ],
                'badge_type' => [
                    'en' => 'Industry Internship',
                    'id' => 'Magang Industri',
                    'zh' => '企业实习',
                ],
                'points' => [
                    'Developed and maintained web and mobile application features using Next.js, CSS, JavaScript, Flutter, and backend integration.',
                    'Built CRUD functionalities and optimized database operations for internal enterprise applications.',
                    'Collaborated with the engineering team to improve system functionality, code maintainability, and user experience.',
                    'Participated in application testing, systematic debugging, and frontend/backend performance optimization.',
                    'Contributed to software architecture documentation and deployment workflows.',
                ],
                'skills' => ['Next.js', 'Flutter', 'JavaScript', 'CSS3', 'Backend Integration', 'CRUD', 'REST API'],
                'icon' => 'briefcase',
                'accent_color' => '#EF4444',
                'media' => [],
                'priority_order' => 1,
                'is_active' => true,
            ],
            [
                'type' => 'work',
                'role' => [
                    'en' => 'Internship (Information Systems)',
                    'id' => 'Internship (Sistem Informasi & Data)',
                    'zh' => '信息化系统实习生 (Information Systems)',
                ],
                'company' => [
                    'en' => 'Kementerian Keuangan Republik Indonesia',
                    'id' => 'Kementerian Keuangan Republik Indonesia',
                    'zh' => '印度尼西亚共和国财政部 (Kementerian Keuangan RI)',
                ],
                'location' => [
                    'en' => 'Jakarta, ID',
                    'id' => 'Jakarta, ID',
                    'zh' => '雅加达，印尼',
                ],
                'period' => [
                    'en' => 'Oct 2021 - Jan 2022',
                    'id' => 'Okt 2021 - Jan 2022',
                    'zh' => '2021年10月 - 2022年1月',
                ],
                'badge_type' => [
                    'en' => 'Government Internship',
                    'id' => 'Magang Pemerintahan',
                    'zh' => '政府机构实习',
                ],
                'points' => [
                    'Assisted in information systems operations and administrative digital workflow processes.',
                    'Supported enterprise data management, technical documentation, and digital record archives.',
                    'Participated in internal system operational workflows and digital archiving modernization initiatives.',
                    'Collaborated with ministry staff members to support daily operational and technical governance activities.',
                    'Gained practical experience in institutional organizational workflows, security standards, and cross-team collaboration.',
                ],
                'skills' => ['Information Systems', 'Data Management', 'Digital Archiving', 'Governance', 'Technical Support'],
                'icon' => 'briefcase',
                'accent_color' => '#3B82F6',
                'media' => [],
                'priority_order' => 2,
                'is_active' => true,
            ],
            [
                'type' => 'organization',
                'role' => [
                    'en' => 'Head of Student Welfare Division III',
                    'id' => 'Kepala Divisi Kesejahteraan Mahasiswa III',
                    'zh' => '第三学生福利部负责人 (Head of Student Welfare)',
                ],
                'company' => [
                    'en' => 'Informatics Engineering Association Faculty of Engineering Pancasila University',
                    'id' => 'Himpunan Mahasiswa Teknik Informatika Fakultas Teknik Universitas Pancasila',
                    'zh' => '潘查希拉大学工程学院计算机工程学生会 (HMTIF FT-UP)',
                ],
                'location' => [
                    'en' => 'Jakarta, ID',
                    'id' => 'Jakarta, ID',
                    'zh' => '雅加达，印尼',
                ],
                'period' => [
                    'en' => 'Nov 2023 - Apr 2024',
                    'id' => 'Nov 2023 - Apr 2024',
                    'zh' => '2023年11月 - 2024年4月',
                ],
                'badge_type' => [
                    'en' => 'Organizational Leadership',
                    'id' => 'Kepemimpinan Organisasi',
                    'zh' => '学生会核心领导',
                ],
                'points' => [
                    'Led and coordinated student welfare advocacy programs and academic support for Informatics Engineering students.',
                    'Facilitated transparent communication channels and mediation between student representatives and faculty leadership.',
                    'Organized peer coding tutorials, technology seminars, and developer community study groups.',
                    'Supervised divisional team members, task allocation, and budgeting for student support initiatives.',
                ],
                'skills' => ['Leadership', 'Community Management', 'Event Organization', 'Problem Solving', 'Public Speaking'],
                'icon' => 'organization',
                'accent_color' => '#8B5CF6',
                'media' => [],
                'priority_order' => 3,
                'is_active' => true,
            ],

            // ── Education ──
            [
                'type' => 'education',
                'role' => [
                    'en' => 'Bachelor of Computer Science / Informatics Engineering (S.Kom)',
                    'id' => 'S1 Teknik Informatika (Sarjana Komputer - S.Kom)',
                    'zh' => '计算机工程学士 (S.Kom / B.S. in Computer Science)',
                ],
                'company' => [
                    'en' => 'Universitas Pancasila',
                    'id' => 'Universitas Pancasila',
                    'zh' => '潘查希拉大学 (Universitas Pancasila)',
                ],
                'location' => [
                    'en' => 'Jakarta, ID',
                    'id' => 'Jakarta, ID',
                    'zh' => '雅加达，印尼',
                ],
                'period' => [
                    'en' => '2021 - 2025',
                    'id' => '2021 - 2025',
                    'zh' => '2021 - 2025',
                ],
                'badge_type' => [
                    'en' => 'Undergraduate Degree',
                    'id' => 'Gelar Sarjana',
                    'zh' => '全日制本科学士',
                ],
                'points' => [
                    'Specialized in Software Engineering, Modern Web & Mobile Systems, and Relational Database Architectures.',
                    'Academic focus: High-performance Laravel backends, reactive React/TypeScript SPAs, and real-time 3D WebGL graphics.',
                    'Active contributor to campus developer chapters, peer tutoring, and academic research activities.',
                ],
                'skills' => ['Informatics Engineering', 'Software Architecture', 'Database Systems', 'Laravel & React', 'Computer Graphics'],
                'icon' => 'graduation',
                'accent_color' => '#EC4899',
                'media' => [],
                'priority_order' => 1,
                'is_active' => true,
            ],
            [
                'type' => 'education',
                'role' => [
                    'en' => 'Professional Tech Academies & Certifications',
                    'id' => 'Akademi Teknologi & Sertifikasi Industri',
                    'zh' => '前沿技术学院与行业专业认证',
                ],
                'company' => [
                    'en' => 'Dicoding Indonesia, FreeCodeCamp & Coursera',
                    'id' => 'Dicoding Indonesia, FreeCodeCamp & Coursera',
                    'zh' => 'Dicoding Indonesia, FreeCodeCamp & Coursera',
                ],
                'location' => [
                    'en' => 'Online / Industry Credential',
                    'id' => 'Daring / Kredensial Global',
                    'zh' => '在线认证 / 全球认可',
                ],
                'period' => [
                    'en' => '2021 - 2024',
                    'id' => '2021 - 2024',
                    'zh' => '2021 - 2024',
                ],
                'badge_type' => [
                    'en' => 'Professional Certification',
                    'id' => 'Sertifikasi Profesional',
                    'zh' => '专业技术认证',
                ],
                'points' => [
                    'Graduated from verified learning paths in Full-Stack Web Development, Modern JavaScript, Flutter Mobile Apps, and SQL Database Systems.',
                    'Passed rigorous code reviews and built production-grade capstone applications adhering to industry coding standards.',
                ],
                'skills' => ['Full-Stack Web', 'Modern JavaScript', 'Flutter & Dart', 'SQL Query Optimization', 'FreeCodeCamp', 'Dicoding'],
                'icon' => 'award',
                'accent_color' => '#F59E0B',
                'media' => [],
                'priority_order' => 2,
                'is_active' => true,
            ],
            [
                'type' => 'education',
                'role' => [
                    'en' => 'Senior High School (Mathematics & Natural Sciences / MIPA)',
                    'id' => 'Sekolah Menengah Atas (MIPA / IPA)',
                    'zh' => '高级中学 (数理自然科学方向 / MIPA)',
                ],
                'company' => [
                    'en' => 'SMA / Secondary High School',
                    'id' => 'SMA / Sekolah Menengah Atas',
                    'zh' => '高级中学 (SMA)',
                ],
                'location' => [
                    'en' => 'Jakarta, ID',
                    'id' => 'Jakarta, ID',
                    'zh' => '雅加达，印尼',
                ],
                'period' => [
                    'en' => '2018 - 2021',
                    'id' => '2018 - 2021',
                    'zh' => '2018 - 2021',
                ],
                'badge_type' => [
                    'en' => 'High School Diploma',
                    'id' => 'Ijazah SMA',
                    'zh' => '高中毕业证书',
                ],
                'points' => [
                    'Focused on Mathematics and Natural Sciences, cultivating rigorous algorithmic logic, quantitative problem-solving, and analytical reasoning.',
                ],
                'skills' => ['Mathematics & Science', 'Logical Reasoning', 'Algorithmic Thinking', 'Computing Basics'],
                'icon' => 'book',
                'accent_color' => '#10B981',
                'media' => [],
                'priority_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($experiences as $data) {
            Experience::updateOrCreate(
                [
                    'type' => $data['type'],
                    'priority_order' => $data['priority_order'],
                ],
                $data
            );
        }
    }
}
