/* eslint-disable react/no-unescaped-entities */
import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";

export default function Home() {
  return (
    <div className="prose dark:prose-invert">
      <h1 className="mb-1">hey, I'm freitas</h1>
      <p className="text-xl mt-1 mb-4">software engineer</p>

      <div className="flex items-center gap-5 a">
        <a className="flex items-center gap-1 group">
          <span>email</span>
          <svg
            width="15px"
            height="15px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-0 group-hover:opacity-100 duration-200"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M20 4C21.6569 4 23 5.34315 23 7V17C23 18.6569 21.6569 20 20 20H4C2.34315 20 1 18.6569 1 17V7C1 5.34315 2.34315 4 4 4H20ZM19.2529 6H4.74718L11.3804 11.2367C11.7437 11.5236 12.2563 11.5236 12.6197 11.2367L19.2529 6ZM3 7.1688V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7.16882L13.8589 12.8065C12.769 13.667 11.231 13.667 10.1411 12.8065L3 7.1688Z"
              fill="white"
            />
          </svg>
        </a>
        <a
          href="https://github.com/freeitas"
          className="flex items-center gap-1 group"
        >
          <span>github</span>

          <svg
            width="15px"
            height="15px"
            viewBox="0 0 20 20"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-0 group-hover:opacity-100 duration-200"
          >
            <defs></defs>
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g transform="translate(-140.000000, -7559.000000)" fill="white">
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"></path>
                </g>
              </g>
            </g>
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/guilhermehfds/"
          className="group flex items-center gap-1"
        >
          <span>linkedin</span>
          <svg
            width="15px"
            height="15px"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-0 group-hover:opacity-100 duration-200"
          >
            <rect x="0" fill="none" width="20" height="20" />

            <g>
              <path
                d="M2.5 18h3V6.9h-3V18zM4 2c-1 0-1.8.8-1.8 1.8S3 5.6 4 5.6s1.8-.8 1.8-1.8S5 2 4 2zm6.6 6.6V6.9h-3V18h3v-5.7c0-3.2 4.1-3.4 4.1 0V18h3v-6.8c0-5.4-5.7-5.2-7.1-2.6z"
                fill="white"
              />
            </g>
          </svg>
        </a>
        <a
          href="/index.pdf"
          className="group flex items-center gap-1 group"
        >
          <span>cv</span>
          <svg
            fill="white"
            width="20px"
            height="20px"
            viewBox="-8 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-0 group-hover:opacity-100 duration-200"
          >
            <path d="M13.52 5.72h-7.4c-0.36 0-0.56 0.2-0.6 0.24l-5.28 5.28c-0.040 0.040-0.24 0.24-0.24 0.56v12.2c0 1.24 1 2.24 2.24 2.24h11.24c1.24 0 2.24-1 2.24-2.24v-16.040c0.040-1.24-0.96-2.24-2.2-2.24zM5.28 8.56v1.8c0 0.32-0.24 0.56-0.56 0.56h-1.84l2.4-2.36zM14.080 24.040c0 0.32-0.28 0.56-0.56 0.56h-11.28c-0.32 0-0.56-0.28-0.56-0.56v-11.36h3.040c1.24 0 2.24-1 2.24-2.24v-3.040h6.52c0.32 0 0.56 0.24 0.56 0.56l0.040 16.080z"></path>
          </svg>
        </a>
      </div>
      <hr />
      {allPosts.map((post) => (
        <article key={post._id}>
          <Link href={post.slug}>
            <h2 className="mb-1">{post.title}</h2>
          </Link>
          {post.description && <p className="mt-1">{post.description}</p>}
        </article>
      ))}
    </div>
  );
}
