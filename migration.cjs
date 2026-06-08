const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

const MOVES = [
  // Shared Components
  { old: 'components/common', new: 'shared/components' },
  { old: 'components/shared', new: 'shared/components' },
  
  // Shared Utils
  { old: 'utils', new: 'shared/utils' },
  
  // Data
  { old: 'mockDB', new: 'data/mockDB' },
  
  // Misplaced components
  { old: 'components/teacherHome', new: 'components/teacher' },
  
  // Pages
  { old: 'pages/AchievementsPage.jsx', new: 'pages/shared/AchievementsPage.jsx' },
  { old: 'pages/AdminDashboard.jsx', new: 'pages/shared/AdminDashboard.jsx' }, // Check if used
  { old: 'pages/ClubsCommitteesPage.jsx', new: 'pages/shared/ClubsCommitteesPage.jsx' },
  { old: 'pages/CoursesPage.jsx', new: 'pages/shared/CoursesPage.jsx' },
  { old: 'pages/DocumentsPage.jsx', new: 'pages/shared/DocumentsPage.jsx' },
  { old: 'pages/ExaminationPage.jsx', new: 'pages/shared/ExaminationPage.jsx' },
  { old: 'pages/FacultyPage.jsx', new: 'pages/shared/FacultyPage.jsx' },
  { old: 'pages/FeeDetailsPage.jsx', new: 'pages/shared/FeeDetailsPage.jsx' },
  { old: 'pages/MentorSupportPage.jsx', new: 'pages/shared/MentorSupportPage.jsx' },
  { old: 'pages/SchoolCalendarPage.jsx', new: 'pages/shared/SchoolCalendarPage.jsx' },
  { old: 'pages/StudentProfilePage.jsx', new: 'pages/shared/StudentProfilePage.jsx' },
  { old: 'pages/SubjectDetailPage.jsx', new: 'pages/shared/SubjectDetailPage.jsx' },
  { old: 'pages/TransportPage.jsx', new: 'pages/shared/TransportPage.jsx' },
  { old: 'pages/WeeklyTimetablePage.jsx', new: 'pages/shared/WeeklyTimetablePage.jsx' },
];

// Helper to get all files
function getAllFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

// 1. Ensure target directories exist
const dirsToCreate = [
  'shared/components',
  'shared/hooks',
  'shared/utils',
  'shared/constants',
  'shared/config',
  'data/mockDB',
  'components/teacher',
  'pages/shared'
];

dirsToCreate.forEach(d => {
  const fullPath = path.join(SRC_DIR, d);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// 2. Perform Physical Moves
console.log('--- Moving Files ---');
MOVES.forEach(m => {
  const oldPath = path.join(SRC_DIR, m.old);
  const newPath = path.join(SRC_DIR, m.new);
  
  if (fs.existsSync(oldPath)) {
    if (fs.statSync(oldPath).isDirectory()) {
      // Move all contents of directory
      const files = fs.readdirSync(oldPath);
      files.forEach(f => {
        fs.renameSync(path.join(oldPath, f), path.join(newPath, f));
      });
      fs.rmdirSync(oldPath);
      console.log(`Moved dir ${m.old} -> ${m.new}`);
    } else {
      // Move single file
      fs.renameSync(oldPath, newPath);
      console.log(`Moved file ${m.old} -> ${m.new}`);
    }
  }
});

// 3. Update Imports across all files
console.log('--- Updating Imports ---');
const allFiles = getAllFiles(SRC_DIR);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We only replace string literals in import/require statements
  // This is a naive regex but works for well-formatted projects
  
  // Pattern replacements
  const replacements = [
    { from: /(['"])((?:\.\.\/|\.\/)+)components\/common\//g, to: '$1$2shared/components/' },
    { from: /(['"])((?:\.\.\/|\.\/)+)components\/shared\//g, to: '$1$2shared/components/' },
    { from: /(['"])((?:\.\.\/|\.\/)+)utils\//g, to: '$1$2shared/utils/' },
    { from: /(['"])((?:\.\.\/|\.\/)+)mockDB/g, to: '$1$2data/mockDB' },
    { from: /(['"])((?:\.\.\/|\.\/)+)components\/teacherHome\//g, to: '$1$2components/teacher/' },
  ];

  // Specific page replacements for App.jsx and routes
  const pageReplacements = [
    'AchievementsPage', 'AdminDashboard', 'ClubsCommitteesPage', 'CoursesPage',
    'DocumentsPage', 'ExaminationPage', 'FacultyPage', 'FeeDetailsPage',
    'MentorSupportPage', 'SchoolCalendarPage', 'StudentProfilePage',
    'SubjectDetailPage', 'TransportPage', 'WeeklyTimetablePage'
  ];

  pageReplacements.forEach(page => {
    const fromRegex = new RegExp(`(['"])((?:\\.\\.\\/|\\.\\/)+)pages\\/${page}(['"])`, 'g');
    const toStr = `$1$2pages/shared/${page}$3`;
    content = content.replace(fromRegex, toStr);
  });

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${path.relative(SRC_DIR, file)}`);
  }
});

console.log('--- Migration Complete ---');
