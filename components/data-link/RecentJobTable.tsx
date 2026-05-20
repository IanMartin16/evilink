// src/components/data-link/RecentJobsTable.tsx

"use client";

import { downloadJobFile } from "@/lib/dataLinkApi";
import { getProcessingTime } from "@/lib/timeUtils";

type RecentJobsTableProps = {
  jobs: any[];
};

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

export function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  return (
    <section className="dl-panel">
      <div className="dl-panel-header">
        <div>
          <h2>Recent jobs</h2>
          <p>Your latest processed files and cleanup status.</p>
        </div>
      </div>

      <div className="dl-table-wrap">
        <table className="dl-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Status</th>
              <th>Records</th>
              <th>Reduction</th>
              <th>Process time</th>
              <th>Expires</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={7}>No jobs yet.</td>
              </tr>
            )}

            {jobs.map((job) => {
              const processTime = getProcessingTime(job);

              return (
                <tr key={job.job_id}>
                  <td>
                    <strong>{job.original_file_name}</strong>
                    <small>
                      {job.format?.toUpperCase()} · {job.file_size_mb} MB
                    </small>
                  </td>

                  <td>
                    <span
                      className={`dl-badge ${
                        job.files_deleted
                          ? "dl-badge-expired"
                          : `dl-badge-${job.status?.toLowerCase()}`
                      }`}
                    >
                      {job.files_deleted ? "EXPIRED" : job.status}
                    </span>
                  </td>

                  <td>{formatNumber(job.total_records)}</td>

                  <td>
                    <strong className="dl-reduction-value">
                      {job.reduction_percentage}%
                    </strong>
                  </td>

                  <td>{processTime || "—"}</td>

                  <td>
                    {job.files_deleted
                      ? "Expired"
                      : job.expires_at
                        ? new Date(job.expires_at).toLocaleString()
                        : "—"}
                  </td>

                  <td>
                    {job.can_download && job.download_url ? (
                      <button
                        className="dl-table-link dl-link-button"
                        onClick={() => downloadJobFile(job.job_id)}
                      >
                        Download
                      </button>
                    ) : job.status === "FAILED" ? (
                      <span className="dl-table-muted">View error</span>
                    ) : (
                      <span className="dl-table-muted">Unavailable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}