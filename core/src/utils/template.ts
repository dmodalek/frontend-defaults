const PLACEHOLDER_EXPR = /<%([^%>]+)?%>/g;
const STATEMENT_EXPR = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;

export function template(html: string, options: object): string {
	let code = 'var r=[];\n';
	let cursor = 0;
	let match: RegExpExecArray | null;

	const add = (line: string, isExecutableStatement?: boolean) => {
		if (isExecutableStatement) {
			code += line.match(STATEMENT_EXPR) ? line + '\n' : `r.push(${line});\n`;
		} else {
			code += line != '' ? `r.push("${line.replace(/"/g, '\\"')}");\n` : '';
		}

		return add;
	};

	while ((match = PLACEHOLDER_EXPR.exec(html))) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}

	add(html.substr(cursor, html.length - cursor));
	code += 'return r.join("");';

	return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}
