// Centralized helpers for Live Class (Meeting) feature
// Normalization, status derivation, fetching via apiClient

import { API_ENDPOINTS } from "@/config/urls";
import { apiGet, handleApiResponse } from "./apiClient";

export interface MeetingRaw {
  id?: string; // backend may use id or _id
  _id?: string;
  title: string;
  description?: string;
  link: string;
  startTime?: string; // new field
  scheduledTime?: string; // legacy fallback
  endTime?: string; // explicit end
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  link: string;
  startTime: string; // ISO
  endTime: string; // ISO
}

export type MeetingStatus = "live" | "starting" | "upcoming" | "ended";

export interface AnnotatedMeeting extends Meeting {
  status: MeetingStatus;
  startMs: number;
  endMs: number;
  diffStart: number; // start - now
  diffEnd: number; // end - now
  durationMin: number;
}

export const STARTING_SOON_WINDOW_MIN = 15; // single source of truth

export const normalizeMeetings = (raw: any[]): Meeting[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((m: MeetingRaw) => {
    const start = m.startTime || m.scheduledTime || new Date().toISOString();
    const end = m.endTime || m.startTime || m.scheduledTime || start;
    return {
      id: (m.id || m._id || crypto.randomUUID()).toString(),
      title: m.title || "Untitled Session",
      description: m.description,
      link: m.link || "#",
      startTime: start,
      endTime: end,
    } as Meeting;
  });
};

export const annotateMeetings = (
  meetings: Meeting[],
  now: number = Date.now(),
): AnnotatedMeeting[] => {
  return meetings
    .slice()
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
    .map((m) => {
      const startMs = new Date(m.startTime).getTime();
      const endMs = new Date(m.endTime || m.startTime).getTime();
      const diffStart = startMs - now;
      const diffEnd = endMs - now;
      const isLive = now >= startMs && now <= endMs;
      const windowMs = STARTING_SOON_WINDOW_MIN * 60_000;
      const isStartingSoon = diffStart > 0 && diffStart <= windowMs;
      const isUpcoming = diffStart > windowMs;
      const isEnded = now > endMs;
      let status: MeetingStatus = "upcoming";
      if (isLive) status = "live";
      else if (isStartingSoon) status = "starting";
      else if (isUpcoming) status = "upcoming";
      else if (isEnded) status = "ended";
      const durationMin = Math.max(
        1,
        Math.round((endMs - startMs) / 60000) || 0,
      );
      return {
        ...m,
        status,
        startMs,
        endMs,
        diffStart,
        diffEnd,
        durationMin,
      } as AnnotatedMeeting;
    });
};

export const formatRelative = (ms: number): string => {
  const abs = Math.abs(ms);
  const sign = ms < 0 ? -1 : 1;
  const unit =
    abs < 60_000 ? "s" : abs < 3_600_000 ? "m" : abs < 86_400_000 ? "h" : "d";
  let val: number;
  switch (unit) {
    case "s":
      val = Math.round(abs / 1000);
      break;
    case "m":
      val = Math.round(abs / 60_000);
      break;
    case "h":
      val = Math.round(abs / 3_600_000);
      break;
    default:
      val = Math.round(abs / 86_400_000);
  }
  return sign === -1 ? `${val}${unit} ago` : `in ${val}${unit}`;
};

// Fetch meetings for a single course via centralized apiClient
export const fetchCourseMeetings = async (
  courseId: string,
): Promise<Meeting[]> => {
  try {
    const res = await apiGet(API_ENDPOINTS.STUDENT.MEETINGS(courseId));
    const data = await handleApiResponse<any>(res);
    const list = Array.isArray(data)
      ? data
      : data?.data || data?.meetings || [];
    return normalizeMeetings(list);
  } catch (e) {
    console.error("fetchCourseMeetings error", e);
    return [];
  }
};

// Fetch meetings across multiple courses (fan-out) - returns merged list
export const fetchMeetingsForCourses = async (
  courseIds: string[],
): Promise<Meeting[]> => {
  if (!courseIds.length) return [];
  // Limit to first 8 to avoid spamming backend (tweak as needed)
  const limited = courseIds.slice(0, 8);
  const results = await Promise.all(
    limited.map((id) => fetchCourseMeetings(id)),
  );
  return results.flat();
};
