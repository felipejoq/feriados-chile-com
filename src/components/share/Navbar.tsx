import { useEffect, useState } from "react";
import type {LinkItem} from "../../interfaces/navbar/links-items.ts";

interface Props {
    linkList?: LinkItem[];
}

export const Navbar = ({ linkList }: Props) => {
    const defaultLinks: LinkItem[] = [
        { text: "Inicio", target: "_self", href: "/" },
    ];

    const list = linkList && linkList.length > 0 ? linkList : defaultLinks;
    const [currentPath, setCurrentPath] = useState("");

    useEffect(() => {
        const path = window.location.pathname.replace(/^\/|\/$/g, "");
        setCurrentPath(path);
    }, []);

    return (
      <nav className="w-full flex items-center justify-center mt-4 mb-4">
          <ul className="max-w-3xl w-full rounded-xl flex justify-center gap-2">
              {list.map((item) => {
                  const linkPath = item.href.replace(/^\/|\/$/g, "").split("/").pop() || "";
                  const isActive = currentPath === linkPath;

                  const baseClasses =
                    "px-4 py-1 rounded-lg transition-all font-bold border border-gray-500";
                  const activeClasses = "text-white bg-gray-800";
                  const inactiveClasses = "text-gray-800 hover:underline";

                  return (
                    <li key={item.href}>
                        <a
                          href={item.href}
                          target={item.target}
                          className={`${baseClasses} ${
                            isActive ? activeClasses : inactiveClasses
                          }`}
                        >
                            {item.text}
                        </a>
                    </li>
                  );
              })}
          </ul>
      </nav>
    );
};
