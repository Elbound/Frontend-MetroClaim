import React, { useMemo, useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Plane, MapPin, CalendarDays } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';
import getTripManager from '@/api/trip/getTripManager';
import { startOfDay, addDays, isWithinInterval, format } from 'date-fns';

export default function TripCalendarWidget() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.tk) return;
      try {
        setLoading(true);
        const allTripData = await getTripManager(user.tk);
        const ongoingTrips = allTripData?.filter(t => t.status === 'Ongoing') || [];
        setTripData(ongoingTrips);
      } catch (err) {
        console.error("Calendar Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.tk]);

  // Generate the grey highlighted dates
  const tripDates = useMemo(() => {
    const dates = [];
    tripData?.forEach(trip => {
      if (!trip.startDate || !trip.endDate) return;
      let current = startOfDay(new Date(trip.startDate));
      const end = startOfDay(new Date(trip.endDate));
      while (current <= end) {
        dates.push(new Date(current));
        current = addDays(current, 1);
      }
    });
    return dates;
  }, [tripData]);

  // Filter trips for the specific selected date
  const activeTrips = useMemo(() => {
    if (!selectedDate) return [];
    return tripData.filter(trip => 
      isWithinInterval(startOfDay(selectedDate), {
        start: startOfDay(new Date(trip.startDate)),
        end: startOfDay(new Date(trip.endDate))
      })
    );
  }, [selectedDate, tripData]);

  if (loading) {
    return (
      <Card className="max-w-2xl h-[380px] flex items-center justify-center border-2 border-dashed rounded-xl mx-auto">
        <Loader2 className="animate-spin text-muted-foreground" />
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm mx-auto overflow-hidden">
      <CardContent className="p-0 flex flex-col sm:flex-row min-h-[360px]">
        
        {/* LEFT: CALENDAR */}
        <div className="p-3 flex justify-center items-center bg-white dark:bg-slate-950">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            modifiers={{ hasTrip: tripDates }}
            modifiersStyles={{
              // The Grey Highlight for dates with trips
              hasTrip: { 
                backgroundColor: '#f1f5f9', // slate-100
                color: '#475569', // slate-600
                borderRadius: '4px'
              },
              // The Black Highlight for the selected date (overrides hasTrip)
              selected: {
                backgroundColor: '#000000', 
                color: '#ffffff',
                borderRadius: '4px'
              }
            }}
            // Force the selected class to be black regardless of theme
            classNames={{
              day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white"
            }}
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex-1 p-5 bg-slate-50/50 dark:bg-slate-900/50 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {format(selectedDate, 'dd MMM yyyy')}
            </h3>
          </div>

          <div className="space-y-3">
            {activeTrips.length > 0 ? (
              activeTrips.map((trip, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Trip Title</p>
                  <p className="text-xs font-bold leading-tight text-slate-900 dark:text-slate-50">
                    {trip.tripTitle || trip.title || "Untitled Trip"}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] text-slate-500 font-medium">{trip.categoryName}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 opacity-30">
                <Plane className="h-6 w-6 mb-2" />
                <p className="text-[10px] text-center font-medium">No trips scheduled</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}