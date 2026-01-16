"use client";

type ResultCardProps = {
  data: {
    company_name?: string;
    website?: string;
    summary?: string;
    emails?: string[];
    phone_numbers?: string[];
    socials?: { platform: string; url: string }[];
    sources?: string[];
  };
};

export default function ResultCard({ data }: ResultCardProps) {
  const company =
    data.company_name ||
    data.website?.replace("https://", "").replace("http://", "").split("/")[0] ||
    "Unknown Company";

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>📊 Analysis Result</h2>

      <p>
        <strong>Company:</strong> {company}
      </p>

      {data.website && (
        <p>
          <strong>Website:</strong>{" "}
          <a href={data.website} target="_blank" rel="noreferrer">
            {data.website}
          </a>
        </p>
      )}

      {data.summary && (
        <p>
          <strong>Summary:</strong>
          <br />
          {data.summary}
        </p>
      )}

      {data.emails?.length ? (
        <p>
          <strong>Emails:</strong>
          <br />
          {data.emails.join(", ")}
        </p>
      ) : null}

      {data.phone_numbers?.length ? (
        <p>
          <strong>Phone Numbers:</strong>
          <br />
          {data.phone_numbers.join(", ")}
        </p>
      ) : null}

      {data.socials?.length ? (
        <div>
          <strong>Social Links:</strong>
          <ul>
            {data.socials.map((s, idx) => (
              <li key={idx}>
                {s.platform}:{" "}
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {data.sources?.length ? (
        <div>
          <strong>Sources:</strong>
          <ul>
            {data.sources.map((src, idx) => (
              <li key={idx}>
                <a href={src} target="_blank" rel="noreferrer">
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}