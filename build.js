import fs from 'fs';

const parts = ['part_data.js', 'part_logic.js', 'part_components.js', 'part_main_1.js', 'part_main_2.js', 'part_views.js', 'part_views_2.js', 'part_views_3.js', 'part_views_4.js', 'part_views_5.js', 'part_views_6.js', 'part_views_7.js', 'part_app.js'];
let content = '';
for (const p of parts) {
    if (fs.existsSync(p)) {
        content += fs.readFileSync(p, 'utf8') + '\n';
    }
}

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<script type="text\/babel">[\s\S]*?<\/script>/, () => '<script type="text/babel">\n' + content + '\n</script>');

fs.writeFileSync('index.html', html);
if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/index.html', html);
    console.log('Successfully concatenated files into index.html and dist/index.html');
} else {
    console.log('Successfully concatenated files into index.html');
}
