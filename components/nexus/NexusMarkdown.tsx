export function NexusMarkdown({
  text,
}: {
  text: string;
}) {
  const parts = text.split(/```/g);

  return (
    <>
      {parts.map((chunk, idx) => {
        const isCodeBlock = idx % 2 === 1;

        if (isCodeBlock) {
          return (
            <pre
              key={idx}
              style={{
                margin: "10px 0",
                padding: 12,
                borderRadius: 12,
                background: "rgba(0,0,0,0.06)",
                overflowX: "auto",
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              <code>
                {chunk.replace(/^\w+\n/, "")}
              </code>
            </pre>
          );
        }

        const inline = chunk
          .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
          .filter(Boolean)
          .map((token, tokenIndex) => {
            if (
              token.startsWith("**") &&
              token.endsWith("**")
            ) {
              return (
                <strong key={tokenIndex}>
                  {token.slice(2, -2)}
                </strong>
              );
            }

            if (
              token.startsWith("`") &&
              token.endsWith("`")
            ) {
              return (
                <code
                  key={tokenIndex}
                  style={{
                    padding: "2px 6px",
                    borderRadius: 8,
                    background:
                      "rgba(0,0,0,0.06)",
                    fontSize: 12,
                  }}
                >
                  {token.slice(1, -1)}
                </code>
              );
            }

            return (
              <span key={tokenIndex}>
                {token}
              </span>
            );
          });

        return <span key={idx}>{inline}</span>;
      })}
    </>
  );
}