import TeacherNoticeBoard from "../../components/teacher/TeacherNoticeBoard";
import TeacherModuleHeader from "../../components/teacher/TeacherModuleHeader";

const TeacherNoticesPage = () => {
  return (
    <div className="space-y-8 pb-12">
      <TeacherModuleHeader
        titleKey="nav.teacher_notices"
        descriptionKey="Operational Notice Board"
        helperContentEn="View action-required notices, academic updates, administrative announcements, and class teacher-specific communications. Filter by urgency, category, or read status."
        helperContentHi="कार्य-आवश्यक सूचनाएं, शैक्षिक अपडेट, प्रशासनिक घोषणाएं और कक्षा शिक्षक-विशिष्ट संचार देखें। तात्कालिकता, श्रेणी या पढ़ी गई स्थिति के अनुसार फ़िल्टर करें।"
      />

      <TeacherNoticeBoard />
    </div>
  );
};

export default TeacherNoticesPage;
