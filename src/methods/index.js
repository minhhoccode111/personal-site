export function get(key = 'loginState') {
  const data = localStorage.getItem(key);
  return data === null ? {} : JSON.parse(data);
}

export function set(value, key = 'loginState') {
  localStorage.setItem(key, JSON.stringify(value));
}

// parse escaped string from server to html dom
export function domParser(str) {
  if (!str) return '';
  // console.log(`the str in dom parser belike: `, str);

  const parser = new DOMParser();

  // unescaped special characters from server
  return parser.parseFromString(str, 'text/html').documentElement.textContent;
}

export function markdownParser(str) {
  if (!str) return '';

  const rules = [
    //header rules
    [/#{6}\s?([^\n]+)/g, '<h6 className="text-xs font-bold">$1</h6>'],
    [/#{5}\s?([^\n]+)/g, '<h5 className="text-ms font-bold">$1</h5>'],
    [/#{4}\s?([^\n]+)/g, '<h4 className="font-bold">$1</h4>'],
    [/#{3}\s?([^\n]+)/g, '<h3 className="text-lg font-bold">$1</h3>'],
    [/#{2}\s?([^\n]+)/g, '<h2 className="text-xl font-bold">$1</h2>'],
    [/#{1}\s?([^\n]+)/g, '<h1 className="text-2xl font-bold">$1</h1>'],

    //bold, italics and paragraph rules
    [/\*\*\s?([^\n]+)\*\*/g, '<b>$1</b>'],
    [/\*\s?([^\n]+)\*/g, '<i>$1</i>'],
    [/__([^_]+)__/g, '<b>$1</b>'],
    [/_([^_`]+)_/g, '<i>$1</i>'],
    [/([^\n]+\n?)/g, '<p>$1</p>'],

    //links
    [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" className="text-link">$1</a>'],

    //highlights
    // [/(`)(\s?[^\n,]+\s?)(`)/g, '<a style="background-color:grey;color:black;text-decoration: none;border-radius: 3px;padding:0 2px;">$2</a>'],
    [/(`)(\s?[^\n,]+\s?)(`)/g, '<a className="bg-gray-300 text-slate-900 rounded-md px-1">$2</a>'],

    //Lists
    [/([^\n]+)(\+)([^\n]+)/g, '<ul><li>$3</li></ul>'],
    [/([^\n]+)(\*)([^\n]+)/g, '<ul><li>$3</li></ul>'],

    //Image
    [/!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g, '<img className="block w-full" src="$2" alt="$1" title="$3" />'],
  ];

  // console.log(str);
  rules.forEach(([rule, template]) => {
    // console.log('the str belike: ', str);
    // console.log(`the rule belike: `, rule);
    // console.log(`the template belike: `, template);
    str = str.replace(rule, template);
  });
  // console.log(str);

  return str;
}
