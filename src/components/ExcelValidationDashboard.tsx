import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, FileWarning, Filter, Info, ShieldAlert } from 'lucide-react';
import { ValidationIssue } from '../types';

interface ExcelValidationDashboardProps {
  validationIssues: ValidationIssue[];
  totalOrderCount: number;
}

export default function ExcelValidationDashboard({
  validationIssues,
  totalOrderCount
}: ExcelValidationDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const issueCount = validationIssues.length;
  const validCount = Math.max(0, totalOrderCount - issueCount);

  // 누락 항목별 통계 계산
  const stats = {
    수령인: validationIssues.filter(i => i.missingFields.includes('수령인')).length,
    주소: validationIssues.filter(i => i.missingFields.includes('주소')).length,
    연락처: validationIssues.filter(i => i.missingFields.includes('연락처')).length,
    상품명: validationIssues.filter(i => i.missingFields.includes('상품명')).length,
    수량: validationIssues.filter(i => i.missingFields.includes('수량')).length,
    우편번호: validationIssues.filter(i => i.missingFields.includes('우편번호')).length,
  };

  // 필터링된 이슈 목록
  const filteredIssues = validationIssues.filter(issue => {
    if (selectedFilter === 'all') return true;
    return issue.missingFields.includes(selectedFilter);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      {/* 헤더 요약 바 */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-colors ${
          issueCount > 0 ? 'bg-amber-50/70 hover:bg-amber-50' : 'bg-emerald-50/70 hover:bg-emerald-50'
        }`}
      >
        <div className="flex items-center gap-3">
          {issueCount > 0 ? (
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">
                엑셀 데이터 유효성 검사 결과
              </h3>
              {issueCount > 0 ? (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  ⚠️ 필수 항목 누락 {issueCount}건 발견
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  ✅ 모든 필수 항목 정상 기입됨 ({totalOrderCount}건)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-5-00 mt-0.5">
              {issueCount > 0 
                ? `전체 ${totalOrderCount}건 중 ${validCount}건 정상 / ${issueCount}건 필수 정보(수령인/주소/연락처 등) 누락`
                : `업로드된 ${totalOrderCount}건의 주문 데이터에 누락된 필수 필드가 없습니다.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-xs font-medium text-slate-600 hidden sm:inline">
            {isExpanded ? '접기' : '상세보기'}
          </span>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* 펼침 영역 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200"
          >
            {issueCount === 0 ? (
              <div className="p-6 text-center text-slate-600 bg-slate-50/50">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">모든 엑셀 데이터가 유효합니다!</p>
                <p className="text-xs text-slate-500 mt-1">
                  수령인, 주소, 연락처, 상품명, 수량이 완벽히 기입되어 즉시 출고 및 요약보고서 생성이 가능합니다.
                </p>
              </div>
            ) : (
              <div className="p-5">
                {/* 항목별 누락 통계 카드 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                  {Object.entries(stats).map(([key, count]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFilter(selectedFilter === key ? 'all' : key)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        selectedFilter === key 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200'
                          : count > 0 
                            ? 'border-amber-200 bg-amber-50/60 text-slate-800 hover:bg-amber-100/80' 
                            : 'border-slate-200 bg-slate-50/50 text-slate-400 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="text-xs text-slate-500 font-medium">{key} 누락</div>
                      <div className={`text-base font-bold mt-0.5 ${count > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                        {count} <span className="text-xs font-normal">건</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 필터 안내 바 */}
                <div className="flex items-center justify-between mb-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {selectedFilter === 'all' 
                        ? `전체 누락 데이터 목록 (${filteredIssues.length}건)` 
                        : `"${selectedFilter}" 누락 데이터 목록 (${filteredIssues.length}건)`}
                    </span>
                  </div>
                  {selectedFilter !== 'all' && (
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      전체 보기
                    </button>
                  )}
                </div>

                {/* 테이블 목록 */}
                <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="text-xs text-slate-600 bg-slate-100 uppercase sticky top-0 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2.5 w-28">엑셀 행 (위치)</th>
                        <th className="px-3 py-2.5 w-28">수령인</th>
                        <th className="px-3 py-2.5 w-44">상품명</th>
                        <th className="px-3 py-2.5">주소</th>
                        <th className="px-3 py-2.5 w-32">연락처</th>
                        <th className="px-3 py-2.5 w-44">누락 항목</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredIssues.map((issue) => (
                        <tr key={issue.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="px-3 py-2 font-mono text-slate-600">
                            <span className="font-semibold text-amber-800">{issue.fileName}</span>
                            <br />
                            <span className="text-slate-500">[{issue.rowIndex}행]</span>
                          </td>
                          <td className="px-3 py-2 font-medium">
                            {issue.missingFields.includes('수령인') ? (
                              <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                (미입력)
                              </span>
                            ) : (
                              issue.recipient
                            )}
                          </td>
                          <td className="px-3 py-2 truncate max-w-[180px]" title={issue.productName}>
                            {issue.missingFields.includes('상품명') ? (
                              <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                (미입력)
                              </span>
                            ) : (
                              issue.productName
                            )}
                          </td>
                          <td className="px-3 py-2 truncate max-w-[220px]" title={issue.address}>
                            {issue.missingFields.includes('주소') ? (
                              <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                (미입력)
                              </span>
                            ) : (
                              issue.address
                            )}
                          </td>
                          <td className="px-3 py-2 font-mono text-slate-600">
                            {issue.missingFields.includes('연락처') ? (
                              <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                (미입력)
                              </span>
                            ) : (
                              issue.phone
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-1">
                              {issue.missingFields.map((field) => (
                                <span
                                  key={field}
                                  className={`px-1.5 py-0.5 text-[11px] font-bold rounded ${
                                    field === '수령인' || field === '주소' || field === '연락처'
                                      ? 'bg-red-100 text-red-700 border border-red-200'
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}
                                >
                                  {field} 누락
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    원본 엑셀 파일의 해당 행 번호를 참고하여 원본 데이터를 수정하시거나, 발송 시 유의하시기 바랍니다.
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
