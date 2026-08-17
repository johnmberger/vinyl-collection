import { ImageResponse } from "next/og";
import { getSiteHost, getSiteTitle } from "@/lib/site";

export const alt = getSiteTitle();
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadFraunces(text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&text=${encodeURIComponent(text)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    }
  ).then((response) => response.text());

  const match = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );

  if (!match) {
    throw new Error("Could not load Fraunces for the social card");
  }

  const font = await fetch(match[1]);
  if (!font.ok) {
    throw new Error("Could not download Fraunces for the social card");
  }

  return font.arrayBuffer();
}

export default async function Image() {
  const title = getSiteTitle();
  const host = getSiteHost();
  const fraunces = await loadFraunces(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "#100e0c",
          padding: "0 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 380,
            height: 380,
            borderRadius: 190,
            background: "#0c0b09",
            border: "4px solid #d4a574",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 276,
              height: 276,
              borderRadius: 138,
              border: "1.5px solid #3f3a34",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 180,
                height: 180,
                borderRadius: 90,
                border: "1.5px solid #3f3a34",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  background: "#d4a574",
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 640,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#f3ead8",
              fontSize: 96,
              fontFamily: "Fraunces",
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {host ? (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                color: "#9c9488",
                fontSize: 42,
              }}
            >
              {host}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: fraunces,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
