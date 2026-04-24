//seeded app data

export const FACULTIES = [
  { id: 'FICT', code: 'FICT', name: 'Faculty of Information and Communication Technology', shortName: 'FICT', color: '#0284C9' },
  { id: 'FABE', code: 'FABE', name: 'Faculty of Architecture and the Built Environment', shortName: 'FABE', color: '#0A3556' },
  { id: 'FBMG', code: 'FBMG', name: 'Faculty of Business and Globalization', shortName: 'FBMG', color: '#79BBD9' },
  { id: 'FCMB', code: 'FCMB', name: 'Faculty of Communication, Media and Broadcasting', shortName: 'FCMB', color: '#0A3556' },
  { id: 'FCTH', code: 'FCTH', name: 'Faculty of Creativity in Tourism and Hospitality', shortName: 'FCTH', color: '#0284C9' },
  { id: 'FDI',  code: 'FDI',  name: 'Faculty of Design Innovation', shortName: 'FDI', color: '#0A3556' },
];

//programme names
export const PROGRAMME_NAMES = {
  //fict degree
  BSCIT:   'BSc in Information Technology',
  BSCBIT:  'BSc in Business Information Technology',
  BSCSM:   'BSc in Software Engineering with Multimedia',
  BSCBITY: 'BSc in Business Information Technology',
  BSCITY:  'BSc in Information Technology',
  BSCSMY:  'BSc in Software Engineering with Multimedia',
  //fict diploma
  DBIT:    'Diploma in Business Information Technology',
  DIT:     'Diploma in Information Technology',
  DMSE:    'Diploma in Multimedia and Software Engineering',
  DBITY:   'Diploma in Business Information Technology',
  DITY:    'Diploma in Information Technology',
  DMSEY:   'Diploma in Multimedia and Software Engineering',
  //fict certificate
  CBIT:    'Certificate in Business Information Technology',
  CIT:     'Certificate in Information Technology',
  CBITY:   'Certificate in Business Information Technology',
  CITMY:   'Certificate in Information Technology with Multimedia',
  CMKY:    'Certificate in Multimedia',
  //fbmg
  BIBM:    'Bachelor in International Business Management',
  BIRM:    'Bachelor in Retail Management',
  BBMG:    'Bachelor in Business Management',
  BBTM:    'Bachelor in Tourism Management',
  BTMY:    'Bachelor in Tourism Management',
  BAHRY:   'Bachelor in Human Resource Management',
  BBJY:    'Bachelor in Business & Journalism',
  BPCY:    'Bachelor in Professional Communication',
  //fdi
  BSBTY:   'Bachelor in Built Technology',
  //fcmb
  DBM:     'Diploma in Business Management',
  DBMY:    'Diploma in Business Management',
  DBRTVY:  'Diploma in Broadcasting (Radio and TV)',
  DJMY:    'Diploma in Journalism and Media',
};

//programmes by faculty
export const PROGRAMMES = {
  FICT: [
    { id: 'BSCBITY', code: 'BSCBITY', name: 'BSc in Business Information Technology', level: 'Degree', years: 4 },
    { id: 'BSCITY',  code: 'BSCITY',  name: 'BSc in Information Technology', level: 'Degree', years: 4 },
    { id: 'BSCSMY',  code: 'BSCSMY',  name: 'BSc in Software Engineering with Multimedia', level: 'Degree', years: 4 },
    { id: 'DBITY',   code: 'DBITY',   name: 'Diploma in Business Information Technology', level: 'Diploma', years: 2 },
    { id: 'DITY',    code: 'DITY',    name: 'Diploma in Information Technology', level: 'Diploma', years: 2 },
    { id: 'DMSEY',   code: 'DMSEY',   name: 'Diploma in Multimedia and Software Engineering', level: 'Diploma', years: 2 },
    { id: 'CBITY',   code: 'CBITY',   name: 'Certificate in Business IT', level: 'Certificate', years: 1 },
    { id: 'CITMY',   code: 'CITMY',   name: 'Certificate in IT with Multimedia', level: 'Certificate', years: 1 },
    { id: 'CMKY',    code: 'CMKY',    name: 'Certificate in Multimedia', level: 'Certificate', years: 1 },
  ],
  FBMG: [
    { id: 'BAHRY',   code: 'BAHRY',   name: 'Bachelor in Human Resource Management', level: 'Degree', years: 3 },
    { id: 'BBJY',    code: 'BBJY',    name: 'Bachelor in Business & Journalism', level: 'Degree', years: 3 },
    { id: 'BPCY',    code: 'BPCY',    name: 'Bachelor in Professional Communication', level: 'Degree', years: 3 },
    { id: 'BTMY',    code: 'BTMY',    name: 'Bachelor in Tourism Management', level: 'Degree', years: 3 },
    { id: 'DBMY',    code: 'DBMY',    name: 'Diploma in Business Management', level: 'Diploma', years: 2 },
  ],
  FABE: [
    { id: 'BSBTY',   code: 'BSBTY',   name: 'Bachelor in Built Technology', level: 'Degree', years: 4 },
  ],
  FCMB: [
    { id: 'DBRTVY',  code: 'DBRTVY',  name: 'Diploma in Broadcasting (Radio and TV)', level: 'Diploma', years: 2 },
    { id: 'DJMY',    code: 'DJMY',    name: 'Diploma in Journalism and Media', level: 'Diploma', years: 2 },
  ],
  FCTH: [
    { id: 'BTMY',    code: 'BTMY',    name: 'Bachelor in Tourism Management', level: 'Degree', years: 3 },
  ],
  FDI: [
    { id: 'FDI_DIPL', code: 'FDI_DIPL', name: 'Diploma in Creative Advertising', level: 'Diploma', years: 2 },
  ],
};

//staff list
export const STAFF = [
  //fict
  { id: 's001', name: 'Mrs. Diana Moopisa',       role: 'FMG',      faculty: 'FICT', email: 'diana.moopisa@limkokwing.ac.ls' },
  { id: 's002', name: 'Mr. Kapela Morutwa',        role: 'PL',       faculty: 'FICT', email: 'kapela.morutwa@limkokwing.ac.ls' },
  { id: 's003', name: 'Mr. Tsietsi Matjele',       role: 'PL',       faculty: 'FICT', email: 'tsietsi.matjele@limkokwing.ac.ls' },
  { id: 's004', name: 'Mr. Mpotla Nthunya',        role: 'PRL',      faculty: 'FICT', email: 'mpotla.nthunya@limkokwing.ac.ls' },
  { id: 's005', name: 'Ms. Khauhelo Mahlakeng',    role: 'PRL',      faculty: 'FICT', email: 'khauhelo.mahlakeng@limkokwing.ac.ls' },
  { id: 's006', name: 'Mr. Batloung Hlabeli',      role: 'PRL',      faculty: 'FICT', email: 'hlabeli.batloung@limkokwing.ac.ls' },
  { id: 's007', name: 'Mr. Takura Bhila',          role: 'PRL',      faculty: 'FICT', email: 'takura.bhila@limkokwing.ac.ls' },
  { id: 's008', name: 'Ms. Palesa Ntho',           role: 'Lecturer', faculty: 'FICT', email: 'palesa.ntho@limkokwing.ac.ls' },
  { id: 's009', name: 'Ms. Uduak Imo Ebisoh',      role: 'Lecturer', faculty: 'FICT', email: 'uduak.ebisoh@limkokwing.ac.ls' },
  { id: 's010', name: 'Mr. Tsepo Mofolo',          role: 'Lecturer', faculty: 'FICT', email: 'tsepo.mofolo@limkokwing.ac.ls' },
  { id: 's011', name: 'Mr. Mohale Tlali',          role: 'Lecturer', faculty: 'FICT', email: 'mohale.tlali@limkokwing.ac.ls' },
  { id: 's012', name: 'Mr. Molemo Borotho',        role: 'Lecturer', faculty: 'FICT', email: 'molemo.borotho@limkokwing.ac.ls' },
  { id: 's013', name: 'Ms. Nthatisi Monakalali',   role: 'Lecturer', faculty: 'FICT', email: 'nthatisi.monakalali@limkokwing.ac.ls' },
  { id: 's014', name: 'Mr. Motobatsi Maseli',      role: 'Lecturer', faculty: 'FICT', email: 'motobatsi.maseli@limkokwing.ac.ls' },
  { id: 's015', name: 'Ms. Mamolapi Serutla',      role: 'Lecturer', faculty: 'FICT', email: 'mamolapi.serutla@limkokwing.ac.ls' },
  { id: 's016', name: 'Mr. Tsekiso Thokoana',      role: 'Lecturer', faculty: 'FICT', email: 'tsekiso.thokoana@limkokwing.ac.ls' },
  { id: 's017', name: 'Ms. Liteboho Molaoa',       role: 'Lecturer', faculty: 'FICT', email: 'liteboho.molaoa@limkokwing.ac.ls' },
  { id: 's018', name: 'Mr. Thato Makheka',         role: 'Lecturer', faculty: 'FICT', email: 'thato.makheka@limkokwing.ac.ls' },
  { id: 's019', name: 'Mr. Makhaola Kuena',        role: 'Lecturer', faculty: 'FICT', email: 'makhaola.kuena@limkokwing.ac.ls' },
  { id: 's020', name: 'Ms. Manapo Sekopo',         role: 'Lecturer', faculty: 'FICT', email: 'manapo.sekopo@limkokwing.ac.ls' },
  { id: 's021', name: 'Mr. Tseliso Moorosi',       role: 'Lecturer', faculty: 'FICT', email: 'tseliso.moorosi@limkokwing.ac.ls' },
  { id: 's022', name: 'Ms. Mantsebo Molapo',       role: 'Lecturer', faculty: 'FICT', email: 'mantsebo.molapo@limkokwing.ac.ls' },
  { id: 's023', name: 'Ms. Khauta Rantai',         role: 'Lecturer', faculty: 'FICT', email: 'khauta.rantai@limkokwing.ac.ls' },
  { id: 's024', name: 'Mr. Itumeleng Mokhachane',  role: 'Lecturer', faculty: 'FICT', email: 'itumeleng.mokhachane@limkokwing.ac.ls' },
  { id: 's025', name: 'Ms. Khauhelo Mahlakeng',   role: 'Lecturer', faculty: 'FICT', email: 'khauhelo.mahlakeng2@limkokwing.ac.ls' },
  { id: 's026', name: 'Ms. Ntsejoa Ranyali',      role: 'Lecturer', faculty: 'FICT', email: 'ntsejoa.ranyali@limkokwing.ac.ls' },
  { id: 's027', name: 'Mr. Mpho Takalimane',       role: 'Lecturer', faculty: 'FICT', email: 'mpho.takalimane@limkokwing.ac.ls' },
  { id: 's028', name: 'Mr. Makhaola Kuena',        role: 'Lecturer', faculty: 'FICT', email: 'makhaola.kuena2@limkokwing.ac.ls' },
  { id: 's029', name: 'Mr. Hlabeli Batloung',      role: 'Lecturer', faculty: 'FICT', email: 'hlabeli.batloung2@limkokwing.ac.ls' },
  { id: 's030', name: 'Mr. Tsietsi Matjele',       role: 'Lecturer', faculty: 'FICT', email: 'tsietsi.matjele2@limkokwing.ac.ls' },
  { id: 's031', name: 'Ms. Masechaba Sechaba',     role: 'Lecturer', faculty: 'FICT', email: 'masechaba.sechaba@limkokwing.ac.ls' },
  { id: 's032', name: 'Ms. Makatleho Mafura',      role: 'Lecturer', faculty: 'FICT', email: 'makatleho.mafura@limkokwing.ac.ls' },
  { id: 's033', name: 'Ms. Diana Moopisa',         role: 'Lecturer', faculty: 'FICT', email: 'diana.moopisa2@limkokwing.ac.ls' },
  //fabe
  { id: 's100', name: 'Mr. Ramohlaboli Khotle',   role: 'FMG',      faculty: 'FABE', email: 'ramohlaboli.khotle@limkokwing.ac.ls' },
  { id: 's101', name: 'Mr. Arabang Maama',         role: 'PL',       faculty: 'FABE', email: 'arabang.maama@limkokwing.ac.ls' },
  { id: 's102', name: 'Ms. Mapallo Monoko',        role: 'PRL',      faculty: 'FABE', email: 'mapallo.monoko@limkokwing.ac.ls' },
  { id: 's103', name: 'Mr. Teboho Ntsaba',         role: 'PRL',      faculty: 'FABE', email: 'teboho.ntsaba@limkokwing.ac.ls' },
  { id: 's104', name: 'Ms. Boikokobetso Mohlomi',  role: 'Lecturer', faculty: 'FABE', email: 'boikokobetso.mohlomi@limkokwing.ac.ls' },
  //fbmg
  { id: 's200', name: 'Mr. Hlabathe Posholi',      role: 'FMG',      faculty: 'FBMG', email: 'hlabathe.posholi@limkokwing.ac.ls' },
  { id: 's201', name: 'Ms. Khopotso Molati',       role: 'PL',       faculty: 'FBMG', email: 'khopotso.molati@limkokwing.ac.ls' },
  { id: 's202', name: 'Adv. Kelebone Fosa',        role: 'PL',       faculty: 'FBMG', email: 'kelebone.fosa@limkokwing.ac.ls' },
  { id: 's203', name: 'Mrs. Makatleho Mafura',     role: 'PRL',      faculty: 'FBMG', email: 'makatleho.mafura@limkokwing.ac.ls' },
  { id: 's204', name: 'Ms. Joalane Putsoa',        role: 'PRL',      faculty: 'FBMG', email: 'joalane.putsoa@limkokwing.ac.ls' },
  { id: 's205', name: 'Ms. Mamello Mahlomola',     role: 'PRL',      faculty: 'FBMG', email: 'mamello.mahlomola@limkokwing.ac.ls' },
  { id: 's206', name: 'Ms. Likeleko Damane',       role: 'PRL',      faculty: 'FBMG', email: 'likeleko.damane@limkokwing.ac.ls' },
  { id: 's207', name: 'Ms. Motsabi Korotsoane',    role: 'PRL',      faculty: 'FBMG', email: 'motsabi.korotsoane@limkokwing.ac.ls' },
  //fcmb
  { id: 's300', name: 'Mrs. Papiso Brown',         role: 'FMG',      faculty: 'FCMB', email: 'papiso.brown@limkokwing.ac.ls' },
  { id: 's301', name: 'Dr. Nketsi Moqasa',         role: 'PL',       faculty: 'FCMB', email: 'nketsi.moqasa@limkokwing.ac.ls' },
  { id: 's302', name: 'Ms. Itumeleng Sekhamane',   role: 'PL',       faculty: 'FCMB', email: 'itumeleng.sekhamane@limkokwing.ac.ls' },
  { id: 's303', name: 'Ms. Tsepiso Mncina',        role: 'PRL',      faculty: 'FCMB', email: 'tsepiso.mncina@limkokwing.ac.ls' },
  { id: 's304', name: 'Mr. Teboho Mokonyana',      role: 'PRL',      faculty: 'FCMB', email: 'teboho.mokonyana@limkokwing.ac.ls' },
  { id: 's305', name: 'Mr. Mpaki Molapo',          role: 'PRL',      faculty: 'FCMB', email: 'mpaki.molapo@limkokwing.ac.ls' },
  { id: 's306', name: 'Mr. Thapelo Lebona',        role: 'PRL',      faculty: 'FCMB', email: 'thapelo.lebona@limkokwing.ac.ls' },
  //fcth
  { id: 's400', name: 'Mr. Sebinane Lekoekoe',     role: 'FMG',      faculty: 'FCTH', email: 'sebinane.lekoekoe@limkokwing.ac.ls' },
  { id: 's401', name: 'Ms. Maletela Lehlaha',      role: 'PL',       faculty: 'FCTH', email: 'maletela.lehlaha@limkokwing.ac.ls' },
  { id: 's402', name: 'Mr. Kagiso Ikanyeng',       role: 'PL',       faculty: 'FCTH', email: 'kagiso.ikanyeng@limkokwing.ac.ls' },
  { id: 's403', name: 'Ms. Lieketseng Maketela',   role: 'PRL',      faculty: 'FCTH', email: 'lieketseng.maketela@limkokwing.ac.ls' },
  { id: 's404', name: 'Ms. Tsepang Mahula',        role: 'PRL',      faculty: 'FCTH', email: 'tsepang.mahula@limkokwing.ac.ls' },
  { id: 's405', name: 'Dr. Ngonidzashe Makwindi',  role: 'PRL',      faculty: 'FCTH', email: 'ngonidzashe.makwindi@limkokwing.ac.ls' },
  //fdi
  { id: 's500', name: 'Mr. Molemo Ts\'oeu',        role: 'FMG',      faculty: 'FDI',  email: 'molemo.tsoeu@limkokwing.ac.ls' },
  { id: 's501', name: 'Mrs. Maseabata Telite',     role: 'PL',       faculty: 'FDI',  email: 'maseabata.telite@limkokwing.ac.ls' },
  { id: 's502', name: 'Mrs. Makamohelo Liname',    role: 'PL',       faculty: 'FDI',  email: 'makamohelo.liname@limkokwing.ac.ls' },
  { id: 's503', name: 'Mr. Reauboka Mphale',       role: 'PRL',      faculty: 'FDI',  email: 'reauboka.mphale@limkokwing.ac.ls' },
  { id: 's504', name: 'Mr. Thapelo Sebotsa',       role: 'PRL',      faculty: 'FDI',  email: 'thapelo.sebotsa@limkokwing.ac.ls' },
  { id: 's505', name: 'Ms. Maili Moorosi',         role: 'PRL',      faculty: 'FDI',  email: 'maili.moorosi@limkokwing.ac.ls' },
];

//classes
export const CLASSES = [
  { id: 'BSCBITY1S2', code: 'BSCBITY1S2', programme: 'BSCBITY', year: 1, semester: 2, faculty: 'FICT', studentCount: 35 },
  { id: 'BSCBITY2S2', code: 'BSCBITY2S2', programme: 'BSCBITY', year: 2, semester: 2, faculty: 'FICT', studentCount: 28 },
  { id: 'BSCBITY3S2', code: 'BSCBITY3S2', programme: 'BSCBITY', year: 3, semester: 2, faculty: 'FICT', studentCount: 22 },
  { id: 'BSCBITY4S2', code: 'BSCBITY4S2', programme: 'BSCBITY', year: 4, semester: 2, faculty: 'FICT', studentCount: 15 },
  { id: 'BSCITY1S2',  code: 'BSCITY1S2',  programme: 'BSCITY',  year: 1, semester: 2, faculty: 'FICT', studentCount: 40 },
  { id: 'BSCITY2S2',  code: 'BSCITY2S2',  programme: 'BSCITY',  year: 2, semester: 2, faculty: 'FICT', studentCount: 32 },
  { id: 'BSCITY3S2',  code: 'BSCITY3S2',  programme: 'BSCITY',  year: 3, semester: 2, faculty: 'FICT', studentCount: 25 },
  { id: 'BSCITY4S2',  code: 'BSCITY4S2',  programme: 'BSCITY',  year: 4, semester: 2, faculty: 'FICT', studentCount: 18 },
  { id: 'BSCSMY1S2',  code: 'BSCSMY1S2',  programme: 'BSCSMY',  year: 1, semester: 2, faculty: 'FICT', studentCount: 38 },
  { id: 'BSCSMY2S2',  code: 'BSCSMY2S2',  programme: 'BSCSMY',  year: 2, semester: 2, faculty: 'FICT', studentCount: 30 },
  { id: 'BSCSMY3S2',  code: 'BSCSMY3S2',  programme: 'BSCSMY',  year: 3, semester: 2, faculty: 'FICT', studentCount: 24 },
  { id: 'BSCSMY4S2',  code: 'BSCSMY4S2',  programme: 'BSCSMY',  year: 4, semester: 2, faculty: 'FICT', studentCount: 16 },
  { id: 'DBITY1S2',   code: 'DBITY1S2',   programme: 'DBITY',   year: 1, semester: 2, faculty: 'FICT', studentCount: 45 },
  { id: 'DBITY2S2',   code: 'DBITY2S2',   programme: 'DBITY',   year: 2, semester: 2, faculty: 'FICT', studentCount: 36 },
  { id: 'DITY1S2',    code: 'DITY1S2',    programme: 'DITY',    year: 1, semester: 2, faculty: 'FICT', studentCount: 42 },
  { id: 'DITY2S2',    code: 'DITY2S2',    programme: 'DITY',    year: 2, semester: 2, faculty: 'FICT', studentCount: 34 },
  { id: 'DMSEY1S2',   code: 'DMSEY1S2',   programme: 'DMSEY',   year: 1, semester: 2, faculty: 'FICT', studentCount: 40 },
  { id: 'DMSEY2S2',   code: 'DMSEY2S2',   programme: 'DMSEY',   year: 2, semester: 2, faculty: 'FICT', studentCount: 30 },
  { id: 'CBITY1S1',   code: 'CBITY1S1',   programme: 'CBITY',   year: 1, semester: 1, faculty: 'FICT', studentCount: 50 },
  { id: 'BAHRY3S2',   code: 'BAHRY3S2',   programme: 'BAHRY',   year: 3, semester: 2, faculty: 'FBMG', studentCount: 20 },
  { id: 'BBJY3S2',    code: 'BBJY3S2',    programme: 'BBJY',    year: 3, semester: 2, faculty: 'FBMG', studentCount: 22 },
  { id: 'BPCY3S2',    code: 'BPCY3S2',    programme: 'BPCY',    year: 3, semester: 2, faculty: 'FBMG', studentCount: 18 },
  { id: 'BTMY2S2',    code: 'BTMY2S2',    programme: 'BTMY',    year: 2, semester: 2, faculty: 'FBMG', studentCount: 25 },
  { id: 'BTMY3S2',    code: 'BTMY3S2',    programme: 'BTMY',    year: 3, semester: 2, faculty: 'FBMG', studentCount: 20 },
  { id: 'DBMY1S2',    code: 'DBMY1S2',    programme: 'DBMY',    year: 1, semester: 2, faculty: 'FBMG', studentCount: 35 },
  { id: 'BSBTY4S2',   code: 'BSBTY4S2',   programme: 'BSBTY',   year: 4, semester: 2, faculty: 'FABE', studentCount: 14 },
  { id: 'DBRTVY2S1',  code: 'DBRTVY2S1',  programme: 'DBRTVY',  year: 2, semester: 1, faculty: 'FCMB', studentCount: 18 },
  { id: 'DJMY2S2',    code: 'DJMY2S2',    programme: 'DJMY',    year: 2, semester: 2, faculty: 'FCMB', studentCount: 20 },
];

//courses
export const COURSES = [
  { id: 'BIIP1210', code: 'BIIP1210', name: 'Imperative Programming', faculty: 'FICT' },
  { id: 'BIDB1210', code: 'BIDB1210', name: 'Introduction to Database', faculty: 'FICT' },
  { id: 'BIDC1210', code: 'BIDC1210', name: 'Introduction to Data Communication', faculty: 'FICT' },
  { id: 'BISE1210', code: 'BISE1210', name: 'Principles of Software Engineering', faculty: 'FICT' },
  { id: 'BIBM1210', code: 'BIBM1210', name: 'Business Mathematics II', faculty: 'FICT' },
  { id: 'BIDB2210', code: 'BIDB2210', name: 'Database System', faculty: 'FICT' },
  { id: 'BIBS2210', code: 'BIBS2210', name: 'Business Statistics', faculty: 'FICT' },
  { id: 'BIBI2210', code: 'BIBI2210', name: 'Business Information Systems', faculty: 'FICT' },
  { id: 'BIOP2210', code: 'BIOP2210', name: 'Object Oriented Programming II', faculty: 'FICT' },
  { id: 'BISA2210', code: 'BISA2210', name: 'Systems Analysis and Design', faculty: 'FICT' },
  { id: 'BIWP3210', code: 'BIWP3210', name: 'Web Programming', faculty: 'FICT' },
  { id: 'BIIS3210', code: 'BIIS3210', name: 'Internet Security', faculty: 'FICT' },
  { id: 'BICN3210', code: 'BICN3210', name: 'Computer Network', faculty: 'FICT' },
  { id: 'BBFS3210', code: 'BBFS3210', name: 'Financial Information Systems', faculty: 'FICT' },
  { id: 'BISP3210', code: 'BISP3210', name: 'Software Project Management', faculty: 'FICT' },
  { id: 'BIML3210', code: 'BIML3210', name: 'Machine Learning', faculty: 'FICT' },
  { id: 'BIAI4212', code: 'BIAI4212', name: 'Artificial Intelligence', faculty: 'FICT' },
  { id: 'BIIT4212', code: 'BIIT4212', name: 'Information Technology Auditing', faculty: 'FICT' },
  { id: 'BIKM4210', code: 'BIKM4210', name: 'Knowledge Management', faculty: 'FICT' },
  { id: 'BICC2210', code: 'BICC2210', name: 'Cloud Computing', faculty: 'FICT' },
  { id: 'BIMP3210', code: 'BIMP3210', name: 'Mobile Device Programming', faculty: 'FICT' },
  { id: 'BIDS4212', code: 'BIDS4212', name: 'Distributed System', faculty: 'FICT' },
  { id: 'BIIS323',  code: 'BIIS323',  name: 'Information Systems for Managers', faculty: 'FBMG' },
  { id: 'BIWT3210', code: 'BIWT3210', name: 'Web Technology', faculty: 'FBMG' },
  { id: 'BIIS424',  code: 'BIIS424',  name: 'Internet Security', faculty: 'FABE' },
];

//timetable slots
export const TIMETABLE = [
  //bscsmy3s2
  { classId: 'BSCSMY3S2', courseId: 'BIMP3210', lecturerId: 's016', day: 'Friday',    time: '08:30-10:30', venue: 'MM3', type: 'Lecture' },
  { classId: 'BSCSMY3S2', courseId: 'BISD3210', lecturerId: 's011', day: 'Monday',    time: '08:30-10:30', venue: 'MM5', type: 'Lecture' },
  { classId: 'BSCSMY3S2', courseId: 'BISP3210', lecturerId: 's005', day: 'Monday',    time: '10:30-12:30', venue: 'Room 1', type: 'Lecture' },
  { classId: 'BSCSMY3S2', courseId: 'BIAI3210', lecturerId: 's018', day: 'Tuesday',   time: '08:30-10:30', venue: 'MM5', type: 'Lecture' },
  //bscbity1s2
  { classId: 'BSCBITY1S2', courseId: 'BIIP1210', lecturerId: 's002', day: 'Monday',   time: '10:30-12:30', venue: 'MM1', type: 'Lecture' },
  { classId: 'BSCBITY1S2', courseId: 'BIDB1210', lecturerId: 's013', day: 'Friday',   time: '08:30-10:30', venue: 'MM3', type: 'Lecture' },
  { classId: 'BSCBITY1S2', courseId: 'BIDC1210', lecturerId: 's022', day: 'Tuesday',  time: '08:30-10:30', venue: 'Room 1', type: 'Lecture' },
  { classId: 'BSCBITY1S2', courseId: 'BISE1210', lecturerId: 's020', day: 'Wednesday',time: '08:30-10:30', venue: 'Hall 6', type: 'Lecture' },
  { classId: 'BSCBITY1S2', courseId: 'BIBM1210', lecturerId: 's014', day: 'Monday',   time: '08:30-10:30', venue: 'Hall 6', type: 'Lecture' },
  //bscity3s2
  { classId: 'BSCITY3S2', courseId: 'BIML3210', lecturerId: 's030', day: 'Monday',    time: '08:30-10:30', venue: 'MM4', type: 'Lecture' },
  { classId: 'BSCITY3S2', courseId: 'BICN3210', lecturerId: 's011', day: 'Tuesday',   time: '10:30-12:30', venue: 'Net Lab', type: 'Lecture' },
  { classId: 'BSCITY3S2', courseId: 'BISP3210', lecturerId: 's005', day: 'Friday',    time: '08:30-10:30', venue: 'Net Lab', type: 'Lecture' },
  //bahry3s2
  { classId: 'BAHRY3S2', courseId: 'BIIS323',   lecturerId: 's008', day: 'Thursday',  time: '12:30-14:30', venue: 'Net Lab', type: 'Lecture' },
];

//demo reports
export const REPORTS = [
  {
    id: 'r001',
    facultyName: 'Faculty of Information and Communication Technology',
    className: 'BSCSMY3S2',
    week: 'Week 7',
    dateOfLecture: '2026-02-16',
    courseName: 'Mobile Device Programming',
    courseCode: 'BIMP3210',
    lecturerName: 'Mr. Tsekiso Thokoana',
    studentsPresent: 20,
    registeredStudents: 24,
    venue: 'MM3',
    scheduledTime: '08:30 - 10:30',
    topicTaught: 'React Native Navigation with Expo Router',
    learningOutcomes: 'Students understood file-based routing, stack navigation, and tab navigation patterns in Expo Router v3.',
    recommendations: 'More lab practice sessions needed. Some students struggle with TypeScript types.',
    status: 'Submitted',
    submittedBy: 's016',
    createdAt: '2026-02-16T11:00:00Z',
  },
  {
    id: 'r002',
    facultyName: 'Faculty of Information and Communication Technology',
    className: 'BSCBITY1S2',
    week: 'Week 7',
    dateOfLecture: '2026-02-17',
    courseName: 'Imperative Programming',
    courseCode: 'BIIP1210',
    lecturerName: 'Mr. Kapela Morutwa',
    studentsPresent: 30,
    registeredStudents: 35,
    venue: 'MM1',
    scheduledTime: '10:30 - 12:30',
    topicTaught: 'Arrays and Functions in C',
    learningOutcomes: 'Students can declare and traverse arrays, define functions with parameters and return types.',
    recommendations: 'Recommend additional tutorial sessions on pointers.',
    status: 'Reviewed',
    submittedBy: 's002',
    prlFeedback: 'Good report. Please ensure attendance sheets are attached.',
    createdAt: '2026-02-17T13:00:00Z',
  },
];

//demo users
export const DEMO_USERS = [
  { id: 'u001', email: 'student@luct.ls',              password: 'student123',  role: 'Student',  name: 'Thabo Molefe',          faculty: 'FICT', programme: 'BSCSMY', classId: 'BSCSMY3S2' },
  { id: 'u002', email: 'tsekiso.thokoana@limkokwing.ac.ls', password: 'luct1234', role: 'Lecturer', name: 'Mr. Tsekiso Thokoana', faculty: 'FICT', staffId: 's016' },
  { id: 'u003', email: 'mpotla.nthunya@limkokwing.ac.ls',   password: 'luct1234', role: 'PRL',     name: 'Mr. Mpotla Nthunya',   faculty: 'FICT', staffId: 's004' },
  { id: 'u004', email: 'kapela.morutwa@limkokwing.ac.ls',   password: 'luct1234', role: 'PL',      name: 'Mr. Kapela Morutwa',   faculty: 'FICT', staffId: 's002' },
  { id: 'u005', email: 'diana.moopisa@limkokwing.ac.ls',    password: 'luct1234', role: 'FMG',     name: 'Mrs. Diana Moopisa',   faculty: 'FICT', staffId: 's001' },
  { id: 'u006', email: 'reauboka.mphale@limkokwing.ac.ls',  password: 'luct1234', role: 'PRL',     name: 'Mr. Reauboka Mphale',  faculty: 'FDI',  staffId: 's503' },
];
export const getClassDisplayName = (classCode) => {
  const programmeCode = classCode.replace(/\d.*/, '');
  const name = PROGRAMME_NAMES[programmeCode] || classCode;
  const yearMatch = classCode.match(/Y(\d)/);
  const semMatch  = classCode.match(/S(\d)/);
  const year = yearMatch ? ` | Year ${yearMatch[1]}` : '';
  const sem  = semMatch  ? ` Sem ${semMatch[1]}` : '';
  return `${name}${year}${sem}`;
};
export const getStaffByFaculty = (facultyId) =>
  STAFF.filter(s => s.faculty === facultyId);
export const getTimetableByLecturer = (staffId) =>
  TIMETABLE.filter(t => t.lecturerId === staffId);
export const getReportsByLecturer = (staffId) => {
  const staff = STAFF.find(s => s.id === staffId);
  if (!staff) return [];
  return REPORTS.filter(r => r.lecturerName === staff.name);
};
