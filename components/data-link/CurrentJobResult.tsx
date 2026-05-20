// src/components/data-link/CurrentJobResult.tsx

"use client";

import { downloadJobFile } from "@/lib/dataLinkApi";
import { getProcessingTime, getTotalTime } from "@/lib/timeUtils";

type CurrentJobResultProps = {
  job: any;
};

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

export function CurrentJobResult({ job }: CurrentJobResultProps) {
  const status = job.status;

  async function handleDownload() {
    await downloadJobFile(job.job_id);
  }

  if (status === "PENDING" || status === "PROCESSING") {
    return (
      <section className="dl-panel dl-current-job">
        <div className="dl-job-loading">
          <div className="dl-loader" />

          <div>
            <h2>Processing your file...</h2>
            <p>
              Data_Link is preparing your dataset. Status:{" "}
              <strong>{status}</strong>
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (status === "FAILED") {
    return (
      <section className="dl-panel dl-current-job dl-job-failed">
        <h2>Processing failed</h2>
        <p>{job.error || "The job failed. Please try again."}</p>
      </section>
    );
  }

  if (status === "COMPLETED") {
    const stats = job.stats;
    const processingTime = getProcessingTime(job);
    const totalTime = getTotalTime(job);

    return (
      <section className="dl-panel dl-current-job">
        <div className="dl-panel-header">
          <div>
            <span className="dl-success-pill">Completed</span>

            <h2>Processing completed</h2>

            <p>
              {formatNumber(stats?.total_records)} records analyzed
              {processingTime ? (
                <>
                  {" "}
                  in <strong>{processingTime}</strong>
                </>
              ) : null}
              .
            </p>
          </div>
        </div>

        <div className="dl-result-grid dl-result-grid-extended">
          <div>
            <span>Total records</span>
            <strong>{formatNumber(stats?.total_records)}</strong>
          </div>

          <div>
            <span>Duplicates removed</span>
            <strong>{formatNumber(stats?.duplicates_removed)}</strong>
          </div>

          <div>
            <span>Records kept</span>
            <strong>{formatNumber(stats?.records_kept)}</strong>
          </div>

          <div>
            <span>Reduction</span>
            <strong>{stats?.reduction_percentage ?? 0}%</strong>
          </div>

          <div>
            <span>Process time</span>
            <strong>{processingTime || "—"}</strong>
          </div>
        </div>

        {totalTime && (
          <p className="dl-muted dl-job-time-note">
            Total job time: {totalTime}, including queue and worker pickup.
          </p>
        )}

        {job.can_download && job.download_url ? (
          <button className="dl-primary-btn dl-download" onClick={handleDownload}>
            Download cleaned file
          </button>
        ) : (
          <div className="dl-muted-box">
            File expired or not available for download.
          </div>
        )}
      </section>
    );
  }

  return null;
}