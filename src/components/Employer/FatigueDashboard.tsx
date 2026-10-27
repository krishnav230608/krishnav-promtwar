import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, AlertTriangle, Clock, ShieldCheck, UserCheck, Flame, BellRing, TrendingUp } from 'lucide-react';
import { playTactileFeedbackTone } from '../../utils/voiceAssistant';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';

export default function FatigueDashboard() {
  const { industry, industryKey, liveWorkforce, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'fatigue' | 'overtime'>('all');
  const [relievedIds, setRelievedIds] = useState<string[]>([]);
  const [chartMetric, setChartMetric] = useState<'both' | 'avg' | 'peak'>('both');

  const totalOnDuty = liveWorkforce.length;
  const inOvertime = liveWorkforce.filter((w) => w.elapsedHours > 8).length;
  const inFatigueDanger = liveWorkforce.filter(
    (w) => w.elapsedHours >= industry.maxShiftHours && !relievedIds.includes(w.id)
  ).length;

  const handleRelieve = (id: string, name: string) => {
    playTactileFeedbackTone('success');
    setRelievedIds((prev) => [...prev, id]);
  };

  const filteredStaff = liveWorkforce.filter((w) => {
    if (filter === 'fatigue') return w.elapsedHours >= industry.maxShiftHours;
    if (filter === 'overtime') return w.elapsedHours > 8;
    return true;
  });

  // 7-day historical shift hours trend data tailored per industry
  const sevenDayTrendData = industryKey === 'construction'
    ? [
        { day: 'Mon', date: 'Oct 20', avgHours: 8.4, peakHours: 9.8, otWorkers: 6 },
        { day: 'Tue', date: 'Oct 21', avgHours: 8.2, peakHours: 9.2, otWorkers: 4 },
        { day: 'Wed', date: 'Oct 22', avgHours: 9.1, peakHours: 10.5, otWorkers: 9 },
        { day: 'Thu', date: 'Oct 23', avgHours: 8.9, peakHours: 10.2, otWorkers: 7 },
        { day: 'Fri', date: 'Oct 24', avgHours: 9.6, peakHours: 11.2, otWorkers: 12 },
        { day: 'Sat', date: 'Oct 25', avgHours: 8.5, peakHours: 9.9, otWorkers: 5 },
        { day: 'Sun', date: 'Today', avgHours: 8.8, peakHours: 10.2, otWorkers: 8 }
      ]
    : [
        { day: 'Mon', date: 'Oct 20', avgHours: 7.8, peakHours: 8.5, otWorkers: 3 },
        { day: 'Tue', date: 'Oct 21', avgHours: 8.0, peakHours: 8.8, otWorkers: 4 },
        { day: 'Wed', date: 'Oct 22', avgHours: 8.2, peakHours: 9.2, otWorkers: 5 },
        { day: 'Thu', date: 'Oct 23', avgHours: 7.9, peakHours: 8.4, otWorkers: 2 },
        { day: 'Fri', date: 'Oct 24', avgHours: 8.4, peakHours: 9.4, otWorkers: 6 },
        { day: 'Sat', date: 'Oct 25', avgHours: 7.5, peakHours: 8.0, otWorkers: 1 },
        { day: 'Sun', date: 'Today', avgHours: 8.1, peakHours: 8.9, otWorkers: 4 }
      ];

  const overallAvg = (
    sevenDayTrendData.reduce((acc, curr) => acc + curr.avgHours, 0) / sevenDayTrendData.length
  ).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Total On Duty */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.activeStaff}
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-0.5">
              {totalOnDuty} <span className="text-xs text-slate-400 font-normal">Active</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Overtime Workers */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              {t.inOvertime}
            </span>
            <div className="text-2xl font-black text-amber-950 font-mono tabular-nums mt-0.5">
              {inOvertime} <span className="text-xs text-amber-700 font-normal">Accruing OT</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Critical Fatigue Alerts */}
        <div className="bg-rose-50/80 p-4 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
              {t.fatigueRisk}
            </span>
            <div className="text-2xl font-black text-rose-700 font-mono tabular-nums mt-0.5">
              {inFatigueDanger} <span className="text-xs text-rose-600 font-normal">&gt;{industry.maxShiftHours}h Limit</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Compliance Rule Banner */}
      {inFatigueDanger > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <BellRing className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="font-bold text-rose-950">
                Compliance Flag: {industry.complianceStandard}
              </p>
              <p className="text-[11px] text-rose-800 mt-0.5">
                Staff member has crossed {industry.maxShiftHours} continuous hours without documented relief. Workplace safety violation risk.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Shift Hours Trend Chart (Recharts) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                7-Day Workforce Shift Hours Trend
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              7-Day Average: <strong className="text-slate-800 font-mono">{overallAvg} hrs/shift</strong> · Max Safe Limit: <strong className="text-rose-600 font-mono">{industry.maxShiftHours} hrs</strong>
            </p>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px]">
            <button
              onClick={() => setChartMetric('both')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                chartMetric === 'both' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setChartMetric('avg')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                chartMetric === 'avg' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Avg Hours
            </button>
            <button
              onClick={() => setChartMetric('peak')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                chartMetric === 'peak' ? 'bg-white text-rose-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peak Shift
            </button>
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sevenDayTrendData}
              margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              
              <YAxis
                domain={[5, 13]}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                unit="h"
              />
              
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white rounded-lg p-2.5 shadow-xl text-xs space-y-1 border border-slate-800">
                        <p className="font-bold text-amber-400">
                          {label} ({dataPoint.date})
                        </p>
                        <div className="space-y-0.5 text-[11px] font-mono">
                          <p className="flex justify-between gap-4 text-blue-300">
                            <span>Site Average:</span>
                            <strong className="text-white">{dataPoint.avgHours} hrs</strong>
                          </p>
                          <p className="flex justify-between gap-4 text-rose-300">
                            <span>Peak Shift:</span>
                            <strong className="text-white">{dataPoint.peakHours} hrs</strong>
                          </p>
                          <p className="flex justify-between gap-4 text-amber-300">
                            <span>Staff in OT:</span>
                            <strong className="text-white">{dataPoint.otWorkers} workers</strong>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, paddingBottom: 6 }}
              />

              {/* Safe Maximum Shift Cap Reference Line */}
              <ReferenceLine
                y={industry.maxShiftHours}
                stroke="#e11d48"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Limit (${industry.maxShiftHours}h)`,
                  fill: '#e11d48',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />

              {/* Average Hours Line */}
              {(chartMetric === 'both' || chartMetric === 'avg') && (
                <Line
                  type="monotone"
                  dataKey="avgHours"
                  name="Site Average Hours"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2563eb' }}
                  activeDot={{ r: 5, fill: '#1d4ed8' }}
                />
              )}

              {/* Peak Shift Hours Line */}
              {(chartMetric === 'both' || chartMetric === 'peak') && (
                <Line
                  type="monotone"
                  dataKey="peakHours"
                  name="Peak Shift Hours"
                  stroke="#e11d48"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ r: 3, fill: '#e11d48' }}
                  activeDot={{ r: 5, fill: '#be123c' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
          <span>* Dotted red line denotes safety compliance threshold under {industry.complianceStandard}</span>
          <span className="font-mono">Updated: Real-time telemetry</span>
        </div>
      </div>

      {/* Shift Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Table Header with Filter Controls */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Live Workforce & Fatigue Roster
            </h4>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({liveWorkforce.length})
            </button>
            <button
              onClick={() => setFilter('overtime')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter === 'overtime' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OT ({inOvertime})
            </button>
            <button
              onClick={() => setFilter('fatigue')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter === 'fatigue' ? 'bg-white text-rose-700 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fatigue ({inFatigueDanger})
            </button>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 text-xs">
          {filteredStaff.map((worker) => {
            const isRelieved = relievedIds.includes(worker.id);
            const isCritical = worker.elapsedHours >= industry.maxShiftHours && !isRelieved;
            const isWarning = worker.elapsedHours > 8 && !isCritical;

            return (
              <div
                key={worker.id}
                className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isCritical ? 'bg-rose-50/40' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{worker.name}</span>
                    <span className="text-[11px] text-slate-500">· {worker.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>Started {worker.checkInTime}</span>
                    <span>·</span>
                    <span>{worker.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {worker.elapsedHours.toFixed(1)} hrs
                    </div>
                    <span className="text-[10px] text-slate-400">Elapsed</span>
                  </div>

                  <div>
                    {isRelieved ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px] flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> Relieved & Safe
                      </span>
                    ) : isCritical ? (
                      <button
                        onClick={() => handleRelieve(worker.id, worker.name)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] shadow-sm flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                        title="Dispatch substitute worker and grant mandatory rest break"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" /> Order Rest Break
                      </button>
                    ) : isWarning ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg text-[11px]">
                        Overtime Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-lg text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Normal Shift
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
