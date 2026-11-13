/**
 * Zero-dependency robust HTML DOM parser & query engine for Node.js E2E testing.
 */

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

export class DOMElement {
  constructor(tagName = 'div', attributes = {}, parent = null) {
    this.tagName = tagName.toLowerCase();
    this.attributes = { ...attributes };
    this.parent = parent;
    this.children = [];
    this.rawChildren = []; // includes text nodes
  }

  get id() {
    return this.attributes.id || '';
  }

  get className() {
    return this.attributes.class || '';
  }

  get classList() {
    const classes = this.className.trim().split(/\s+/).filter(Boolean);
    return {
      contains: (cls) => classes.includes(cls),
      add: (cls) => {
        if (!classes.includes(cls)) {
          classes.push(cls);
          this.attributes.class = classes.join(' ');
        }
      },
      remove: (cls) => {
        const idx = classes.indexOf(cls);
        if (idx !== -1) {
          classes.splice(idx, 1);
          this.attributes.class = classes.join(' ');
        }
      },
      toggle: (cls, force) => {
        const has = classes.includes(cls);
        const shouldHave = force !== undefined ? force : !has;
        if (shouldHave && !has) {
          classes.push(cls);
        } else if (!shouldHave && has) {
          classes.splice(classes.indexOf(cls), 1);
        }
        this.attributes.class = classes.join(' ');
        return shouldHave;
      },
      toArray: () => [...classes],
    };
  }

  get dataset() {
    const data = {};
    for (const [key, value] of Object.entries(this.attributes)) {
      if (key.startsWith('data-')) {
        const camel = key.slice(5).replace(/-([a-z])/g, (_, g) => g.toUpperCase());
        data[camel] = value;
      }
    }
    return data;
  }

  get src() {
    return this.attributes.src || '';
  }

  get alt() {
    return this.attributes.alt || '';
  }

  get href() {
    return this.attributes.href || '';
  }

  get value() {
    return this.attributes.value !== undefined ? this.attributes.value : '';
  }

  set value(val) {
    this.attributes.value = String(val);
  }

  getAttribute(name) {
    return this.attributes[name] !== undefined ? this.attributes[name] : null;
  }

  setAttribute(name, val) {
    this.attributes[name] = String(val);
  }

  hasAttribute(name) {
    return this.attributes[name] !== undefined;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  get textContent() {
    return this.rawChildren
      .map((child) => {
        if (typeof child === 'string') return child;
        if (child.tagName === 'script' || child.tagName === 'style') return '';
        return child.textContent;
      })
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  }

  get innerHTML() {
    return this.rawChildren
      .map((child) => (typeof child === 'string' ? child : child.outerHTML))
      .join('');
  }

  get outerHTML() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => (v === '' ? k : `${k}="${v.replace(/"/g, '&quot;')}"`))
      .join(' ');
    const attrStr = attrs ? ` ${attrs}` : '';
    if (VOID_TAGS.has(this.tagName)) {
      return `<${this.tagName}${attrStr} />`;
    }
    return `<${this.tagName}${attrStr}>${this.innerHTML}</${this.tagName}>`;
  }

  matches(selector) {
    return matchesSelector(this, selector.trim());
  }

  closest(selector) {
    let curr = this;
    while (curr) {
      if (curr instanceof DOMElement && curr.matches(selector)) {
        return curr;
      }
      curr = curr.parent;
    }
    return null;
  }

  querySelector(selector) {
    const results = this.querySelectorAll(selector);
    return results.length > 0 ? results[0] : null;
  }

  querySelectorAll(selector) {
    const results = [];
    findMatchingDescendants(this, selector.trim(), results);
    return results;
  }
}

/**
 * Matches a single element against a selector compound (e.g. "button.primary[data-product='pro']")
 */
function matchesSimple(el, part) {
  if (!el || !(el instanceof DOMElement)) return false;
  if (part === '*') return true;

  // Split by classes, IDs, and attribute selectors
  const regex = /([.#]?[a-zA-Z0-9_-]+|\[[^\]]+\])/g;
  const tokens = part.match(regex);
  if (!tokens) return false;

  for (const token of tokens) {
    if (token.startsWith('#')) {
      if (el.id !== token.slice(1)) return false;
    } else if (token.startsWith('.')) {
      if (!el.classList.contains(token.slice(1))) return false;
    } else if (token.startsWith('[')) {
      const attrMatch = token.match(
        /^\[([a-zA-Z0-9_-]+)(?:([~|^$*]?=)(?:"([^"]*)"|'([^']*)'|([^\]]+)))?\]$/,
      );
      if (!attrMatch) return false;
      const [, attrName, op, qVal1, qVal2, rawVal] = attrMatch;
      const expectedVal = qVal1 !== undefined ? qVal1 : qVal2 !== undefined ? qVal2 : rawVal;
      if (!el.hasAttribute(attrName)) return false;
      if (op) {
        const actualVal = el.getAttribute(attrName);
        if (op === '=' && actualVal !== expectedVal) return false;
        if (op === '^=' && !actualVal.startsWith(expectedVal)) return false;
        if (op === '$=' && !actualVal.endsWith(expectedVal)) return false;
        if (op === '*=' && !actualVal.includes(expectedVal)) return false;
        if (op === '~=' && !actualVal.split(/\s+/).includes(expectedVal)) return false;
      }
    } else {
      // tag name
      if (el.tagName !== token.toLowerCase()) return false;
    }
  }
  return true;
}

/**
 * Handles combinators: descendant (" "), child (">"), or comma (",")
 */
function matchesSelector(el, selector) {
  if (selector.includes(',')) {
    return selector.split(',').some((sub) => matchesSelector(el, sub.trim()));
  }

  const parts = selector.trim().split(/\s+/);
  if (parts.length === 1) {
    return matchesSimple(el, parts[0]);
  }

  // Last part must match target element
  const lastPart = parts[parts.length - 1];
  if (!matchesSimple(el, lastPart)) return false;

  // Walk up parents to match ancestors
  let currentEl = el.parent;
  let partIdx = parts.length - 2;

  while (currentEl && partIdx >= 0) {
    const expectedPart = parts[partIdx];
    if (expectedPart === '>') {
      // Strict direct parent
      const parentPart = parts[partIdx - 1];
      if (!matchesSimple(currentEl, parentPart)) return false;
      partIdx -= 2;
      currentEl = currentEl.parent;
    } else {
      // General ancestor
      if (matchesSimple(currentEl, expectedPart)) {
        partIdx--;
      }
      currentEl = currentEl.parent;
    }
  }

  return partIdx < 0;
}

function findMatchingDescendants(root, selector, results) {
  for (const child of root.children) {
    if (child.matches(selector)) {
      results.push(child);
    }
    findMatchingDescendants(child, selector, results);
  }
}

/**
 * Parses raw HTML string into a DOMElement tree root.
 * @param {string} html
 * @returns {DOMElement}
 */
export function parseHTML(html) {
  const root = new DOMElement('root');
  let current = root;

  // Strip DOCTYPE and comments
  const cleanHtml = html.replace(/<!DOCTYPE[^>]*>/gi, '').replace(/<!--[\s\S]*?-->/g, '');

  const tagRegex =
    /<(\/)?([a-zA-Z0-9:-]+)((?:\s+[^"'/>=]+(?:=(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)\s*(\/?)>|([^<]+)/g;

  let match;
  while ((match = tagRegex.exec(cleanHtml)) !== null) {
    const [full, isClosing, tagName, attrString, isSelfClosing, textContent] = match;

    if (textContent) {
      current.rawChildren.push(textContent);
      continue;
    }

    const tag = tagName.toLowerCase();

    if (isClosing) {
      // Close tag: walk back up until we find matching tag or stop at root
      let p = current;
      while (p && p.tagName !== tag && p !== root) {
        p = p.parent;
      }
      if (p && p !== root) {
        current = p.parent || root;
      }
    } else {
      // Open tag
      const attributes = parseAttributes(attrString);
      const elem = new DOMElement(tag, attributes, current);
      current.children.push(elem);
      current.rawChildren.push(elem);

      if (!isSelfClosing && !VOID_TAGS.has(tag)) {
        current = elem;
      }
    }
  }

  return root;
}

function parseAttributes(attrString) {
  const attrs = {};
  if (!attrString) return attrs;

  const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = attrRegex.exec(attrString)) !== null) {
    const [, name, v1, v2, v3] = m;
    const value = v1 !== undefined ? v1 : v2 !== undefined ? v2 : v3 !== undefined ? v3 : '';
    attrs[name] = value;
  }
  return attrs;
}
