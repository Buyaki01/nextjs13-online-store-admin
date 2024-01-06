import { DailyNewUsers } from "./DailyNewUsers"
import { OrdersToday } from "./OrdersToday"
import { EarningsToday } from "./EarningsToday"

export const TodaysPerformance = () => {
  return (
    <div>
      <h1 className="font-bold">Today's Performance</h1>
      <div>
        <DailyNewUsers />
        <OrdersToday />
        <EarningsToday />
      </div>
    </div>
  )
}
