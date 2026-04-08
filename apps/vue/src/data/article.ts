/**
 * Demo: Article
 */

export const BasicFeaturesArticle = `
<h1>Introduction</h1><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://yiitap.pileax.ai/"><span style="color: rgb(24, 144, 255);"><strong>Yiitap&nbsp;</strong></span></a>is An AI powered, Notion-style WYSIWYG rich-text block-based editor, built on top of <span style="font-family: &quot;Arial Black&quot;;">tiptap</span>. 🍀</p><h2>AI Blocks</h2><div provider="deepseek" prompt="Provide a prompt of writing expert for LLM." time="0" data-type="aiBlock"><h3>Not empty</h3><p>This is generated AI Content.</p></div><h3>Empty</h3><div provider="" prompt="Provide a prompt of writing expert for LLM." time="0" data-type="aiBlock"><p></p></div><h2>Multi-Column</h2><div data-type="column-container"><div data-type="column" style="flex-grow: 1;"><h3>🚀 Features</h3><ul><li><p>AI-powered: Smart features to boost productivity.</p></li><li><p>MIT Licensed.</p></li></ul></div><div data-type="column" style="flex-grow: 1;"><h3>🧭 Task</h3><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>UI</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Extensions</p></div></li></ul></div></div><h2>Callout</h2><div icon="🌾" bordercolor="#dddddd" bordercolordark="#333333" backcolor="#eeeeee" backcolordark="rgba(101, 117, 133, 0.16)" data-type="callout"><p><strong>Announcement</strong></p><p>Make writing stand out.</p></div><h2>Blockquote</h2><blockquote><p>A gentleman should constantly strike to become stronger just like the evolution of the universe.</p><p>A gentleman should generously cultivate to become tolerant just like the earth bears everything on it.</p></blockquote><h2>Details</h2><details class="details" open=""><summary>summary</summary><div data-type="detailsContent"><p>Content</p></div></details><h2>Mathematics</h2><p>Supports <span data-latex="\\LaTeX" data-type="inline-math"></span> math expressions.</p><p>The math extension also supports block level math nodes:</p><div data-latex="e^{i\\pi} + 1 = 0" data-type="block-math"></div><h2>Table</h2><table-wrapper><table style="min-width: 100px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Th1</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Th2</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Th3</p></th><th colspan="1" rowspan="1" background=""><p>Th4</p></th></tr><tr><td colspan="1" rowspan="1" background=""><p>List</p></td><td colspan="1" rowspan="1" background=""><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Task 1</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Task 2</p></div></li></ul></td><td colspan="1" rowspan="1" background=""><ul><li><p>List item 1</p></li><li><p>List item 2</p></li></ul></td><td colspan="1" rowspan="1" background=""><ol><li><p>Number one</p></li><li><p>Number two</p></li></ol></td></tr><tr><td colspan="1" rowspan="1" background=""><p>Text</p></td><td colspan="1" rowspan="1" background=""><p>Text</p></td><td colspan="1" rowspan="1" background=""><p>Text</p></td><td colspan="1" rowspan="1" background=""><p>Text</p></td></tr><tr><td colspan="1" rowspan="1" background="#1890ff"><p><span style="color: rgb(255, 255, 255);">Cell Background</span></p></td><td colspan="1" rowspan="1" background=""><p></p></td><td colspan="2" rowspan="1" background=""><p>Merged Cell</p></td></tr></tbody></table></table-wrapper><h2>Image</h2><blockquote><p>A picture is worth a thousand of words.</p></blockquote><p><img src="https://share.pileax.ai/logo.svg" alt="Caption" title="Title" width="410" height="404" containerheight="0" positiony="0"></p><h2>Video</h2><video caption="Caption"><source src="https://videos.pexels.com/video-files/35570103/15071976_1920_1080_30fps.mp4"></video><h2>Audio</h2><audio controls="true" preload="metadata" src="https://www.w3schools.com/html/horse.ogg"></audio><h2>Model Viewer</h2><blockquote><p>Display interactive 3D models</p></blockquote><model-viewer src="https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb" caption="Spacesuit"></model-viewer><h2>List</h2><h3>Unordered List</h3><ul><li><p>List Item 1</p><ul><li><p>List Item 1.1</p></li><li><p>List Item 1.21</p></li></ul></li><li><p>List Item 2</p></li><li><p>List Item 3</p></li></ul><h3>Ordered List</h3><blockquote><p>PDCA</p></blockquote><ol><li><p>Plan</p><ol><li><p>Plan 1</p></li><li><p>Plan 2</p></li></ol></li><li><p>Do</p></li><li><p>Check</p></li><li><p>Adjust</p></li></ol><h3>Task</h3><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Model Viewer</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Diagram</p><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Flow</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Sequence</p></div></li></ul></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Math Formula</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Draggable handler for all blocks</p></div></li></ul><h2>Code Block</h2><blockquote><p>Friendly to developer, with syntax highlight.</p></blockquote><h3>Bash</h3><pre><code class="language-javascript">const name = 'JavaScript';
console.log('Hello, world', name);</code></pre><h3>Go</h3><pre><code class="language-go">package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}</code></pre><h3>Runnable code</h3><pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;Heart Equation&lt;/title&gt;
  &lt;style&gt;
    body {
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    svg {
      stroke: #ff5c8a;
      fill: none;
      stroke-width: 1;
    }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;svg viewBox="-20 -20 40 40" width="400" height="400"&gt;
  &lt;path id="heart-path" /&gt;
&lt;/svg&gt;

&lt;script&gt;
  const path = document.getElementById('heart-path');
  let d = "";
  for (let t = 0; t &lt;= Math.PI * 2; t += 0.01) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    d += (t === 0 ? "M" : "L") + (x / 2).toFixed(3) + "," + (-y / 2).toFixed(3) + " ";
  }
  path.setAttribute("d", d);
&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre><h2>Diagrams</h2><h3>Flowchart</h3><pre><code class="language-mermaid">graph TD
    A[Christmas] --&gt;|Get money| B(Go shoppingsss)
    B --&gt; C{Let me think}
    C --&gt;|One| D[Laptop]
    C --&gt;|Two| E[iPhone]
    C --&gt;|Three| F[Car]</code></pre><h3>Sequence Diagram</h3><pre><code class="language-mermaid">sequenceDiagram
    participant Alice
    participant Bob
    Alice-&gt;John: Hello John, how are you?
    loop Healthcheck
        John-&gt;John: Fight against hypochondria
    end
    Note right of John: Rational thoughts &lt;br/&gt;prevail...
    John--&gt;Alice: Great!
    John-&gt;Bob: How about you?
    Bob--&gt;John: Jolly good!</code></pre><h3>Pie Chat</h3><pre><code class="language-mermaid">---
config:
  theme: 'forest'
---
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
</code></pre><h2>Markdown</h2><table-wrapper><table style="min-width: 340px;"><colgroup><col style="width: 290px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1" colwidth="290" background=""><p style="text-align: center;">Title</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Shortcut</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Remarks</p></th></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>Heading</p></td><td colspan="1" rowspan="1" background=""><p><code>#</code> <code>##</code> <code>###</code> <code>####</code> <code>#####</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>Blockquote</p></td><td colspan="1" rowspan="1" background=""><p><code>&gt;</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>Code</p></td><td colspan="1" rowspan="1" background=""><p><code>\`\`</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>Code Block</p></td><td colspan="1" rowspan="1" background=""><p><code>\`\`\`</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr></tbody></table></table-wrapper><h2>Typography</h2><h3>Heading 3</h3><h4>Heading 4</h4><h3>Paragraph</h3><p>Youth is not a time of life; it is a state of mind; it is not a matter of rosy cheeks, red lips and supple knees; it is a matter of the will, a quality of the imagination, a vigor of the emotions; it is the freshness of the deep springs of life.</p><p>Youth means a temperamental predominance of courage over timidity, of the appetite for adventure over the love of ease. This often exists in a man of 60 more than a boy of 20. Nobody grows old merely by a number of years. We grow old by deserting our ideals.</p><p>Years may wrinkle the skin, but to give up enthusiasm wrinkles the soul. Worry, fear, self-distrust bows the heart and turns the spirit back to dust.</p><p>Whether 60 or 16, there is in every human being’s heart the lure of wonder, the unfailing childlike appetite of what’s next and the joy of the game of living. In the center of your heart and my heart there is a wireless station: so long as it receives messages of beauty, hope, cheer, courage and power from men and from the Infinite, so long are you young.</p><p>When the aerials are down, and your spirit is covered with snows of cynicism and the ice of pessimism, then you are grown old, even at 20, but as long as your aerials are up, to catch waves of optimism, there is hope you may die young at 80.</p><h3>Smart</h3><table-wrapper><table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Title</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Input</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Output</p></th></tr><tr><td colspan="1" rowspan="1" background=""><p>Copyright</p></td><td colspan="1" rowspan="1" background=""><p><code>(c)</code></p></td><td colspan="1" rowspan="1" background=""><p>©</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>Right</p></td><td colspan="1" rowspan="1" background=""><p><code>(r)</code></p></td><td colspan="1" rowspan="1" background=""><p>®</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>Arrow</p></td><td colspan="1" rowspan="1" background=""><p><code>&gt;&gt;</code></p></td><td colspan="1" rowspan="1" background=""><p>»</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>Arrow</p></td><td colspan="1" rowspan="1" background=""><p><code>-&gt;</code></p></td><td colspan="1" rowspan="1" background=""><p>→</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>Not equal</p></td><td colspan="1" rowspan="1" background=""><p><code>!=</code></p></td><td colspan="1" rowspan="1" background=""><p>≠</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>Ratio</p></td><td colspan="1" rowspan="1" background=""><p><code>1/2</code>&nbsp;&nbsp;<code>1/4</code>&nbsp;&nbsp;<code>3/4</code>&nbsp;</p></td><td colspan="1" rowspan="1" background=""><p>½ ¼ ¾&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>Dash</p></td><td colspan="1" rowspan="1" background=""><p><code>--</code></p></td><td colspan="1" rowspan="1" background=""><p>—</p></td></tr></tbody></table></table-wrapper><h3>Emoji 😃</h3><p>🚀&nbsp;&nbsp;<strong>Supports Vue &amp; React</strong> – Seamless integration with both frameworks.<br>📝&nbsp;&nbsp;<strong>Modern Notion-style editor</strong> – Clean, intuitive, and distraction-free.<br>🔧&nbsp;&nbsp;<strong>Highly customizable &amp; extensible</strong> – Built on <strong>Tiptap</strong> &amp; <strong>ProseMirror</strong>.<br>🤖&nbsp;&nbsp;<strong>AI-powered</strong> – Smart features to boost productivity.<br>🧩&nbsp;&nbsp;<strong>Block-based editing</strong> – Manipulate content via <strong>bubble, floating, main, or side menus</strong>.<br>✨&nbsp;&nbsp;<strong>Rich feature set</strong> – Includes <strong>15+ custom extensions</strong> &amp; <strong>50+ UI components</strong>.<br>🌍&nbsp;&nbsp;<strong>I18n</strong> – Includes <strong>10+ languages</strong>.<br>🌗&nbsp; Light &amp; Dark mode.<br>🆓&nbsp; MIT Licensed.</p><h3>Color Highlighter</h3><p>#abc, #00ff00, Info color #2080f0</p><h2>Text</h2><p><span style="font-family: &quot;Arial Black&quot;;"><strong>Bold text</strong></span></p><p><em>Italic text</em></p><p><u>Underline text</u></p><p><s>Strike through text</s></p><hr><p><code>Inline code</code></p><p><span style="color: rgb(255, 77, 79);">Text with color</span></p><p><mark data-color="#FBF3DB" style="background-color: rgb(251, 243, 219); color: inherit;">Text with highlight background</mark></p><p></p>
`

export const BasicFeaturesArticleZh = `
<h1>Yiitap</h1><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://yiitap.pileax.ai/zh/"><span style="color: rgb(24, 144, 255);"><strong>Yiitap</strong></span></a><span style="color: rgb(24, 144, 255);"><strong><em>&nbsp;</em></strong></span>是一个 AI 赋能的 Notion 风格富文本块级编辑器，基于<a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/"><span style="font-family: system-ui;">Tiptap&nbsp;</span></a>🍀。</p><h2>AI 内容块</h2><div provider="deepseek" prompt="提供一个专业写作的AI提示词" time="0" data-type="aiBlock"><h3>已生成</h3><p>这是AI生成的内容</p></div><h3>空白块</h3><div provider="" prompt="提供一个专业写作的AI提示词" time="0" data-type="aiBlock"><p></p><h2></h2><p></p></div><h2>分栏</h2><div data-type="column-container"><div data-type="column" style="flex-grow: 1;"><h3>🚀 特性</h3><ul><li><p>AI 赋能：提供智能功能，提升编辑体验</p></li></ul><ul><li><p>MIT 许可</p></li></ul></div><div data-type="column" style="flex-grow: 1;"><h3>🧭 任务</h3><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>UI</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>扩展</p></div></li></ul></div></div><h2>Callout</h2><h2>高亮块</h2><div icon="🌾" bordercolor="#dddddd" bordercolordark="#333333" backcolor="#eeeeee" backcolordark="rgba(101, 117, 133, 0.16)" data-type="callout"><p><strong>通知</strong></p><p>着重强调的内容</p></div><h2>引用</h2><blockquote><p>天行健，君子以自强不息；<br>地势坤，君子以厚德载物。</p></blockquote><h2>折叠列表</h2><details class="details" open=""><summary>摘要</summary><div data-type="detailsContent"><p>内容</p></div></details><h2>数学公式</h2><p>支持&nbsp;<span data-latex="\\LaTeX" data-type="inline-math"></span>&nbsp;数学表达式。</p><p>也支持块级数学公式节点：</p><div data-latex="e^{i\\pi} + 1 = 0" data-type="block-math"></div><h2>表格</h2><table-wrapper><table style="min-width: 100px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Th1</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Th2</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">Th3</p></th><th colspan="1" rowspan="1" background=""><p>Th3</p></th></tr><tr><td colspan="1" rowspan="1" background=""><p>List</p></td><td colspan="1" rowspan="1" background=""><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Task 1</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Task 2</p></div></li></ul></td><td colspan="1" rowspan="1" background=""><ul><li><p>List item 1</p></li><li><p>List item 2</p></li></ul></td><td colspan="1" rowspan="1" background=""><ol><li><p>Number one</p></li><li><p>Number two</p></li></ol></td></tr><tr><td colspan="1" rowspan="1" background=""><p>Text</p></td><td colspan="1" rowspan="1" background=""><p>Text</p></td><td colspan="1" rowspan="1" background=""><p>Text</p></td><td colspan="1" rowspan="1" background=""><p>Text</p></td></tr><tr><td colspan="1" rowspan="1" background="#1890ff"><p><span style="color: rgb(255, 255, 255);">单元格背景</span></p></td><td colspan="1" rowspan="1" background=""><p></p></td><td colspan="2" rowspan="1" background=""><p>合并单元格</p></td></tr></tbody></table></table-wrapper><h2>图片</h2><blockquote><p>一图胜千言。</p></blockquote><p><img src="https://share.pileax.ai/logo.svg" alt="Caption" title="图片描述" width="410" height="404" containerheight="0" positiony="0"></p><h2>视频</h2><video caption="视频描述"><source src="https://videos.pexels.com/video-files/35570103/15071976_1920_1080_30fps.mp4"></video><h2>音频</h2><audio controls="true" preload="metadata" src="https://www.w3schools.com/html/horse.ogg"></audio><h2>3D模型</h2><blockquote><p>展示3D模型</p></blockquote><model-viewer src="https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb" caption="宇航服"></model-viewer><h2>列表</h2><h3>无序列表</h3><ul><li><p>List Item 1</p><ul><li><p>List Item 1.1</p></li><li><p>List Item 1.21</p></li></ul></li><li><p>List Item 2</p></li><li><p>List Item 3</p></li></ul><h3>有序列表</h3><blockquote><p>PDCA</p></blockquote><ol><li><p>Plan</p><ol><li><p>Plan 1</p></li><li><p>Plan 2</p></li></ol></li><li><p>Do</p></li><li><p>Check</p></li><li><p>Adjust</p></li></ol><h3>任务</h3><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>表情</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>图表</p><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>流程图</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>顺序图</p></div></li></ul></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>数学公式</p></div></li></ul><h2>代码块</h2><blockquote><p>对开发人员友好，支持代码高亮。</p></blockquote><h3>Bash</h3><pre><code class="language-javascript">const name = 'JavaScript';
console.log('Hello, world', name);</code></pre><h3>Go</h3><pre><code class="language-go">package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}</code></pre><h3>可运行</h3><pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;Heart Equation&lt;/title&gt;
  &lt;style&gt;
    body {
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    svg {
      stroke: #ff5c8a;
      fill: none;
      stroke-width: 1;
    }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;svg viewBox="-20 -20 40 40" width="400" height="400"&gt;
  &lt;path id="heart-path" /&gt;
&lt;/svg&gt;

&lt;script&gt;
  const path = document.getElementById('heart-path');
  let d = "";
  for (let t = 0; t &lt;= Math.PI * 2; t += 0.01) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    d += (t === 0 ? "M" : "L") + (x / 2).toFixed(3) + "," + (-y / 2).toFixed(3) + " ";
  }
  path.setAttribute("d", d);
&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre><h2>文本绘图</h2><h3>流程图</h3><pre><code class="language-mermaid">graph TD
    A[Christmas] --&gt;|Get money| B(Go shoppingsss)
    B --&gt; C{Let me think}
    C --&gt;|One| D[Laptop]
    C --&gt;|Two| E[iPhone]
    C --&gt;|Three| F[Car]</code></pre><h3>顺序图</h3><pre><code class="language-mermaid">sequenceDiagram
    participant Alice
    participant Bob
    Alice-&gt;John: Hello John, how are you?
    loop Healthcheck
        John-&gt;John: Fight against hypochondria
    end
    Note right of John: Rational thoughts &lt;br/&gt;prevail...
    John--&gt;Alice: Great!
    John-&gt;Bob: How about you?
    Bob--&gt;John: Jolly good!</code></pre><h3>饼图</h3><pre><code class="language-mermaid">pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
</code></pre><h2>Markdown</h2><h2>Markdown</h2><table-wrapper><table style="min-width: 340px;"><colgroup><col style="width: 290px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1" colwidth="290" background=""><p style="text-align: center;">名称</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">快捷</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">备注</p></th></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>标题</p></td><td colspan="1" rowspan="1" background=""><p><code>#</code> <code>##</code> <code>###</code> <code>####</code> <code>#####</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>引用</p></td><td colspan="1" rowspan="1" background=""><p><code>&gt;</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>行内代码</p></td><td colspan="1" rowspan="1" background=""><p><code>\`\`</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>代码块</p></td><td colspan="1" rowspan="1" background=""><p><code>\`\`\`</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr></tbody></table></table-wrapper><h2>排版</h2><h3>标题 3</h3><h4>标题 4</h4><h3>段落</h3><p>青春不是年华，而是心境；青春不是桃面、丹唇、柔膝，而是深沉的意志，恢宏的想象，炙热的感情；青春是生命的深泉在涌流。</p><p>青春气贯长虹，勇锐盖过怯弱，进取压倒苟安。如此锐气，二十后生而有之，六旬男子则更多见。年岁有加，并非垂老，理想丢弃，方堕暮年。</p><p>岁月悠悠，衰微只及肌肤；热忱抛却，颓废必致灵魂。忧烦，惶恐，丧失自信，定使心灵扭曲，意气如灰。</p><p>无论年届花甲，抑或二八芳龄，心中皆有生命之欢乐，奇迹之诱惑，孩童般天真久盛不衰。人人心中皆有一台天线，只要你从天上人间接受美好、希望、欢乐、勇气和力量的信号，你就青春永驻，风华常存。</p><p>一旦天线下降，锐气便被冰雪覆盖，玩世不恭、自暴自弃油然而生，即使年方二十，实已垂垂老矣；然则只要树起天线，捕捉乐观信号，你就有望在八十高龄告别尘寰时仍觉年轻。</p><h3>快捷输入</h3><table-wrapper><table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1" background=""><p style="text-align: center;">名称</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">输入</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center;">输出</p></th></tr><tr><td colspan="1" rowspan="1" background=""><p>版权</p></td><td colspan="1" rowspan="1" background=""><p><code>(c)</code>&nbsp; <code>(r)</code>&nbsp; <code>(tm)</code>&nbsp;</p></td><td colspan="1" rowspan="1" background=""><p>© ® ™</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>箭头</p></td><td colspan="1" rowspan="1" background=""><p><code>&gt;&gt;</code></p></td><td colspan="1" rowspan="1" background=""><p>»</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>箭头</p></td><td colspan="1" rowspan="1" background=""><p><code>-&gt;</code></p></td><td colspan="1" rowspan="1" background=""><p>→</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>不等号</p></td><td colspan="1" rowspan="1" background=""><p><code>!=</code></p></td><td colspan="1" rowspan="1" background=""><p>≠</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>分类</p></td><td colspan="1" rowspan="1" background=""><p><code>1/2</code></p></td><td colspan="1" rowspan="1" background=""><p>½</p></td></tr><tr><td colspan="1" rowspan="1" background=""><p>长横线</p></td><td colspan="1" rowspan="1" background=""><p><code>--</code></p></td><td colspan="1" rowspan="1" background=""><p>—</p></td></tr></tbody></table></table-wrapper><h2>表情</h2><p>🚀<strong>&nbsp; 支持 Vue &amp; React</strong>： 无缝集成两大主流框架。</p><p>📝<strong>&nbsp; Notion 风格编辑器</strong>： 界面简洁，交互直观。</p><p>🔧<strong>&nbsp; 高度可定制 &amp; 可扩展</strong>： 基于 <strong>Tiptap</strong> &amp; <strong>ProseMirror</strong> 构建。</p><p>🤖<strong>&nbsp; AI 赋能</strong>： 提供智能功能，提升编辑体验。</p><p>🧩<strong>&nbsp; 块级编辑</strong>： 通过 <strong>气泡菜单、悬浮菜单、主菜单、侧边菜单</strong> 轻松操作内容。</p><p>✨<strong>&nbsp; 丰富的特性</strong>： 内置 <strong>15+ 定制扩展</strong> &amp; <strong>50+ 组件</strong>。<br>🌍&nbsp;&nbsp;<strong>国际化：&nbsp;</strong>支持&nbsp;<strong>10+ 语言。</strong></p><p>🌗&nbsp; 支持深色模式。</p><p>🆓&nbsp; MIT 许可。</p><h2>文本</h2><ul><li><p><span style="font-family: &quot;Arial Black&quot;;"><strong>加粗文本</strong></span></p></li><li><p><em>斜体文本</em></p></li><li><p><u>下划线</u></p></li><li><p><s>删除线</s></p></li><li><p><code>行内代码</code></p></li><li><p><span style="color: rgb(255, 77, 79);">文本颜色</span></p></li><li><p><mark data-color="#FBF3DB" style="background-color: rgb(251, 243, 219); color: inherit;">高亮颜色</mark></p></li></ul><p></p>
`
