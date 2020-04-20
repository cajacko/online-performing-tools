import MarkdownIt from "markdown-it";
import { store, ISetChecklists } from "../store";

const parseChecklistFromContent = (content: string) => {
  // Don't continue for content without checklists
  if (!content.match(/\[[ x]\](.*)/gm)) return null;

  // Parse the content as html, makes it easier to grab beginning and end of list
  const md = new MarkdownIt();
  const html = md.render(content);

  let listItems = html.match(/<li>([\s\S]+?)(?=<\/li>)/gm);

  // No list so return null
  if (!listItems || !listItems.length) return null;

  return listItems.map(listItem => {
    let trimmed = listItem.replace(/\[[ xX]\]/gm, "");
    trimmed = trimmed.replace("<li>", "");
    trimmed = trimmed.replace(/\n/gm, " ");
    trimmed = trimmed.replace(/&lt;!--[\s\S]+?--&gt;/gm, "");

    trimmed = trimmed.trim();

    return {
      id: trimmed,
      text: trimmed
    };
  });
};

const getHeadingLevel = (heading: string) => {
  const levelMatch = heading.match(/^#+/);
  return levelMatch && levelMatch[0] ? levelMatch[0].length : 0;
};

const getOrderedMeta = (response: string) => {
  const headings = response.match(/^#+(.*)/gm);
  const contents = response.split(/^#+.*/gm);

  if (!headings) return [];

  let nestedIds: string[] = [];

  const orderedMeta = headings.map((heading, i) => {
    const level = getHeadingLevel(heading);

    const goBackBy =
      nestedIds.length < level ? null : nestedIds.length + 1 - level;

    if (goBackBy) {
      for (let i = 0; i < goBackBy; i++) {
        nestedIds.pop();
      }
    }

    nestedIds.push(heading);

    const content = contents[i + 1];

    return {
      id: nestedIds.join(""),
      heading: heading,
      path: nestedIds.slice(),
      title: heading.replace(/#/gm, ""),
      items: parseChecklistFromContent(content)
    };
  });

  return orderedMeta;
};

const doAllChecklistsHaveSameRoot = (
  metaToCheck: Array<{ path: string[] }>
) => {
  let root: string;

  return metaToCheck.every(({ path }) => {
    if (!root) {
      root = path[0];
      return true;
    }

    return path[0] === root;
  });
};

const parseChecklists = (content: string): ISetChecklists["payload"] => {
  let orderedMeta = getOrderedMeta(content);

  // Keep removing the first item in the path if every checklist contains it. Otherwise we'll be
  // bloating the drop downs with things that don't need to be there
  while (doAllChecklistsHaveSameRoot(orderedMeta)) {
    orderedMeta = orderedMeta.map(meta => {
      return {
        ...meta,
        path: meta.path.slice(1, meta.path.length)
      };
    });
  }

  const checklistsById: ISetChecklists["payload"]["checklistsById"] = orderedMeta.reduce(
    (acc, { id, title, items, heading }, i) => {
      const checklists: string[] = [];

      orderedMeta.forEach((meta, j) => {
        if (i === j) return;

        if (meta.path[meta.path.length - 2] === heading) {
          checklists.push(meta.id);
        }
      });

      return {
        ...acc,
        [id]: {
          id,
          title,
          items,
          checklists
        }
      };
    },
    {}
  );

  // Delete anything without checklist items or checklists
  Object.values(checklistsById).forEach(checklist => {
    if (!checklist) return;

    const { items, checklists, id } = checklist;

    if ((!items || !items.length) && (!checklists || !checklists.length)) {
      delete checklistsById[id];
    }
  });

  return {
    startingChecklists: orderedMeta
      .filter(({ path }) => path.length === 1)
      .map(({ id }) => id),
    checklistsById: checklistsById
  };
};

/**
 * Fetch the checklist data and dispatch the results
 */
const fetchChecklists = () => {
  return fetch(
    "https://raw.githubusercontent.com/cajacko/practices/master/docs/checklists-reference/README.md"
  )
    .then(res => {
      return res.text();
    })
    .then(response => {
      store.dispatch({
        type: "SET_CHECKLISTS",
        payload: parseChecklists(response)
      });
    });
};

export default fetchChecklists;
