import Example from "@/app/components/analytics/firstLinePlot";
import Example2 from "@/app/components/analytics/firstBarPlot";
import WeekCount from "@/app/components/analytics/weeklyCount";
import Test from "@/app/components/analytics/WeeklyZoneCount";
import TriggerTypePie from "@/app/components/analytics/PieChartTriggerTypes";
import WeeklyPercentage from "@/app/components/analytics/WeeklyZonePercentage";
import TriggerTypeTotalCount from "@/app/components/analytics/TriggerTypeTotalCount";
import TriggerTypeTotal from "@/app/components/analytics/TriggerTypeTotalPerc";
import WeeklyTriggerType from "@/app/components/analytics/WeeklyTriggerType";
import WeeklyDogData from "@/app/components/analytics/WeeklyDogData";
import WeeklyDogDataPerc from "@/app/components/analytics/WeeklyDogDataPerc";
import WeeklyStrangerData from "@/app/components/analytics/WeeklyStrangerData";
import WeeklyStrangerDataPerc from "@/app/components/analytics/WeeklyStrangerDataPerc";
import WeeklyMotorData from "@/app/components/analytics/WeeklyMotorData";
import WeeklyMotorDataPerc from "@/app/components/analytics/WeeklyMotorDataPerc";
import WeeklyCatDataPerc from "@/app/components/analytics/WeeklyCatDataPerc";
import AllReactions from "@/app/components/analytics/allreactions";
import RedReactions from "@/app/components/analytics/RedReactionsPerc";
import OnlyGreenReact from "@/app/components/analytics/OnlyGreenReact";
import TriggeriPoLokacijamaPerc from "@/app/components/analytics/TriggeriPoLokacijamaPerc";
import TriggeriPoLokacijamaCount from "@/app/components/analytics/TriggeriPoLokacijamaCount";
// import CalendarGoodBadDays from "@/app/components/analytics/CalendarGoodBadDays";
// import WordCloud from "@/app/components/analytics/WordCloud";
import { getAnalyticsData } from "@/app/hooks/getAnalyticsData";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { getUser } from "@/utils/server/getUser";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { user } = await getUser();
  const { hasAccess, trainerClientData } = await checkTrainerClientAccess(
    user.id,
    userId
  );

  if (!hasAccess) {
    return <div>Error loading client data.</div>;
  }

  const analyticsData = await getAnalyticsData(userId);

  if (analyticsData.error) {
    return (
      <div className="p-4 text-red-500">
        Error loading client journal. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <Example analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <Example2 analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeekCount analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <Test analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 700, height: 800 }}>
        <WeeklyPercentage analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 800, height: 800 }}>
        <AllReactions analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 800, height: 500 }}>
        <TriggerTypePie analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <TriggerTypeTotalCount analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 700, height: 800 }}>
        <TriggerTypeTotal analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 700, height: 800 }}>
        <OnlyGreenReact analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 700, height: 800 }}>
        <RedReactions analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeeklyTriggerType analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeeklyDogData analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeeklyDogDataPerc analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeeklyStrangerData analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeeklyStrangerDataPerc analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeeklyMotorData analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeeklyMotorDataPerc analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 500, height: 500 }}>
        <WeeklyCatDataPerc analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 800, height: 800 }}>
        <TriggeriPoLokacijamaPerc analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 800, height: 800 }}>
        <TriggeriPoLokacijamaCount analyticsData={analyticsData} />
      </div>
      {/* <div className="flex-1 space-y-4" style={{ width: 800, height: 800 }}>
        <CalendarGoodBadDays analyticsData={analyticsData} />
      </div>
      <div className="flex-1 space-y-4" style={{ width: 800, height: 800 }}>
        <WordCloud analyticsData={analyticsData} />
      </div> */}
    </>
  );
}
