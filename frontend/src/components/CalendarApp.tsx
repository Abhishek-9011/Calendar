import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Menu,
} from "lucide-react";

// Types
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  color: string;
}

type ViewMode = "month" | "week" | "day";

// Utility functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days: Date[] = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};

const getWeekDays = (date: Date): Date[] => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }

  return days;
};

// Event Modal Component
const EventModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  selectedDate: Date;
  editingEvent?: CalendarEvent;
}> = ({ isOpen, onClose, onSave, selectedDate, editingEvent }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    color: "#3B82F6",
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description || "",
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        location: editingEvent.location || "",
        color: editingEvent.color,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startTime: "09:00",
        endTime: "10:00",
        location: "",
        color: "#3B82F6",
      });
    }
  }, [editingEvent, isOpen]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    onSave({
      title: formData.title,
      description: formData.description,
      date: selectedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      color: formData.color,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "#3B82F6",
                "#EF4444",
                "#10B981",
                "#F59E0B",
                "#8B5CF6",
                "#EC4899",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${
                    formData.color === color
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 md:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingEvent ? "Update" : "Create"} Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Card Component
const EventCard: React.FC<{
  event: CalendarEvent;
  onClick: () => void;
  compact?: boolean;
}> = ({ event, onClick, compact = false }) => {
  return (
    <div
      onClick={onClick}
      className={`p-1 md:p-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
        compact ? "text-xs mb-1" : "text-sm mb-2"
      }`}
      style={{
        backgroundColor: event.color + "20",
        borderLeft: `3px solid ${event.color}`,
      }}
    >
      <div className="font-medium text-gray-900 truncate">{event.title}</div>
      <div className="text-gray-600 text-xs">
        {event.startTime} - {event.endTime}
      </div>
      {event.location && !compact && (
        <div className="text-gray-500 text-xs flex items-center mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="truncate">{event.location}</span>
        </div>
      )}
    </div>
  );
};

// Calendar Header Component
const CalendarHeader: React.FC<{
  currentDate: Date;
  viewMode: ViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onAddEvent: () => void;
  onMenuToggle?: () => void;
}> = ({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
  onAddEvent,
  onMenuToggle,
}) => {
  const getHeaderText = () => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (viewMode === "week") {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${weekEnd.toLocaleDateString("en-US", {
        // @ts-ignore
        month: viewMode === "month" ? "short" : "long",
        day: "numeric",
        year: "numeric",
      })}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2 md:gap-4">
      <div className="flex items-center space-x-2 md:space-x-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-1 md:hidden hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">
          {getHeaderText()}
        </h1>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={onPrevious}
            className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={onNext}
            className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onToday}
          className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Today
        </button>

        <div className="flex bg-gray-100 rounded-lg p-0.5 md:p-1">
          {(["month", "week", "day"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm font-medium rounded-md transition-colors capitalize ${
                viewMode === mode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {mode === "month" ? "Month" : mode === "week" ? "Week" : "Day"}
            </button>
          ))}
        </div>

        <button
          onClick={onAddEvent}
          className="flex items-center space-x-1 md:space-x-2 px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm"
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Add Event</span>
        </button>
      </div>
    </div>
  );
};

// Month View Component
const MonthView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}> = ({ currentDate, events, onDayClick, onEventClick }) => {
  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-7 border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 md:p-4 text-center text-xs md:text-base font-medium text-gray-900 border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = events.filter((event) =>
              isSameDay(event.date, day)
            );
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(day, today);

            return (
              <div
                key={index}
                className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                }`}
                onClick={() => onDayClick(day)}
              >
                <div
                  className={`text-xs md:text-sm font-medium mb-1 md:mb-2 ${
                    isToday
                      ? "bg-blue-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center"
                      : ""
                  }`}
                >
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      // @ts-ignore
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      compact
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1 md:pl-2">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Week View Component
const WeekView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}> = ({ currentDate, events, onDayClick, onEventClick }) => {
  const weekDays = getWeekDays(currentDate);
  const today = new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={day.toISOString()}
                className={`p-2 md:p-4 text-center border-r last:border-r-0 cursor-pointer hover:bg-gray-50 ${
                  isToday ? "bg-blue-50" : ""
                }`}
                onClick={() => onDayClick(day)}
              >
                <div className="text-xs md:text-sm text-gray-600">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={`text-sm md:text-lg font-medium ${
                    isToday ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7">
          {weekDays.map((day) => {
            const dayEvents = events.filter((event) =>
              isSameDay(event.date, day)
            );
            return (
              <div
                key={day.toISOString()}
                className="min-h-[200px] md:min-h-[400px] p-1 md:p-3 border-r last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onDayClick(day)}
              >
                <div className="space-y-1 md:space-y-2">
                  {dayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      // @ts-ignore
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Day View Component
const DayView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}> = ({ currentDate, events, onEventClick }) => {
  const dayEvents = events.filter((event) =>
    isSameDay(event.date, currentDate)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-3 md:p-4 border-b">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          {formatDate(currentDate)}
        </h3>
      </div>
      <div className="p-3 md:p-4">
        {dayEvents.length === 0 ? (
          <div className="text-center py-8 md:py-12 text-gray-500">
            <Calendar className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 opacity-50" />
            <p className="text-sm md:text-base">
              No events scheduled for this day
            </p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {dayEvents
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="p-3 md:p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all"
                  style={{
                    borderLeftColor: event.color,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                        {event.title}
                      </h4>
                      <div className="flex items-center text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      {event.description && (
                        <div className="flex items-start text-xs md:text-sm text-gray-600">
                          <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 mt-0.5" />
                          <p className="line-clamp-2">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Calendar App Component
const CalendarApp: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize with some sample events
  useEffect(() => {
    const sampleEvents: CalendarEvent[] = [
      {
        id: "1",
        title: "Team Meeting",
        description: "Weekly team sync to discuss project progress",
        date: new Date(),
        startTime: "09:00",
        endTime: "10:00",
        location: "Conference Room A",
        color: "#3B82F6",
      },
      {
        id: "2",
        title: "Lunch with Client",
        date: new Date(Date.now() + 86400000), // Tomorrow
        startTime: "12:00",
        endTime: "13:30",
        location: "Downtown Restaurant",
        color: "#10B981",
      },
    ];
    setEvents(sampleEvents);
  }, []);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    if (viewMode !== "day") {
      setViewMode("day");
    }
    setIsMobileMenuOpen(false);
  };

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (editingEvent) {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id
            ? { ...eventData, id: editingEvent.id }
            : event
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents([...events, newEvent]);
    }
  };

  const renderCalendarView = () => {
    switch (viewMode) {
      case "month":
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        );
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        );
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onPrevious={() => navigateDate("prev")}
          onNext={() => navigateDate("next")}
          onToday={goToToday}
          onViewModeChange={(mode) => {
            setViewMode(mode);
            setIsMobileMenuOpen(false);
          }}
          onAddEvent={handleAddEvent}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Mobile View Mode Selector (only shown when menu is open on mobile) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-md p-3 mb-4">
            <div className="grid grid-cols-3 gap-2">
              {(["month", "week", "day"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                    viewMode === mode
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}

        {renderCalendarView()}

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
        />
      </div>
    </div>
  );
};

export default CalendarApp;
