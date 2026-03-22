// 微信读书公众号文章抓取脚本
// 使用 Cookie 认证获取公众号文章列表

import https from 'https';

const COOKIE = `ptcz=9d62f9f53d92ab64bfd9d3a804c0d5955a8779e933a31d2092dd46adc89e6a25; qq_domain_video_guid_verify=e328afb4327bdd17; _qimei_uuid42=19503170721100ae6d9bb1f8921af056e64d7ec031; pgv_pvid=9979531084; _qimei_q36=; _qimei_h38=a63517236d9bb1f8921af05603000000c19503; _qimei_fingerprint=934ebd8b71dff59718d6e8270e490e9d; pac_uid=0_r1DQRB3rCDj40; omgid=0_r1DQRB3rCDj40; _clck=1i21s76|1|g4k|0; wr_fp=3938050299; wr_skey=FUuYg3YY; wr_vid=311373267; wr_ql=0; wr_rt=web%40SJsJ_dAlUt1xHA5kc1n_AL`;

interface Article {
  title: string;
  author: string;
  cover: string;
  articleUrl: string;
  publishTime: string;
  readCount?: number;
  likeCount?: number;
}

// 获取关注的公众号列表
async function getSubscribedAccounts(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'weread.qq.com',
      path: '/web/userSubscribe',
      method: 'GET',
      headers: {
        'Cookie': COOKIE,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.mpList || []);
        } catch (e) {
          reject(new Error(`解析 JSON 失败: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// 获取公众号文章列表
async function getAccountArticles(mpId: string, count: number = 20): Promise<Article[]> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'weread.qq.com',
      path: `/web/mpArticles?mpId=${mpId}&count=${count}`,
      method: 'GET',
      headers: {
        'Cookie': COOKIE,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const articles = (json.articles || json.data || []).map((a: any) => ({
            title: a.title || a.articleTitle,
            author: a.mpName || a.author,
            cover: a.cover || a.thumbUrl,
            articleUrl: a.articleUrl || `https://weread.qq.com/web/article/${a.articleId}`,
            publishTime: a.publishTime || a.createTime,
            readCount: a.readNum || a.readCount,
            likeCount: a.likeNum || a.likeCount,
          }));
          resolve(articles);
        } catch (e) {
          reject(new Error(`解析文章列表失败: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// 获取文章内容
async function getArticleContent(articleId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'weread.qq.com',
      path: `/web/article/${articleId}`,
      method: 'GET',
      headers: {
        'Cookie': COOKIE,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // 提取正文内容
        const contentMatch = data.match(/<div[^>]*class="article-content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
        if (contentMatch) {
          // 移除 HTML 标签
          const text = contentMatch[1]
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, '\n')
            .replace(/\n+/g, '\n')
            .trim();
          resolve(text.slice(0, 2000)); // 截取前 2000 字符
        } else {
          resolve(data.slice(0, 500));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// 主函数
async function main() {
  console.log('📚 开始抓取微信读书公众号文章...\n');

  try {
    // 1. 获取关注的公众号列表
    console.log('📋 获取关注的公众号列表...');
    const accounts = await getSubscribedAccounts();
    console.log(`   找到 ${accounts.length} 个关注的公众号\n`);

    // 2. 筛选存储相关公众号
    const targetKeywords = ['存储', 'SSD', 'AI', '系统', '架构', '随笔'];
    const targetAccounts = accounts.filter((a: any) => {
      const name = a.name || a.mpName || '';
      return targetKeywords.some(k => name.includes(k)) ||
             name.includes('王知鱼') ||
             name.includes('存储随笔');
    });

    console.log('🎯 目标公众号：');
    targetAccounts.forEach((a: any) => {
      console.log(`   - ${a.name || a.mpName} (ID: ${a.mpId || a.id})`);
    });
    console.log('');

    // 3. 抓取文章
    const allArticles: Article[] = [];

    for (const account of targetAccounts) {
      const mpId = account.mpId || account.id;
      const mpName = account.name || account.mpName;
      console.log(`📖 抓取 [${mpName}] 的文章...`);

      try {
        const articles = await getAccountArticles(mpId, 10);
        console.log(`   获取到 ${articles.length} 篇文章`);

        for (const article of articles) {
          allArticles.push({
            ...article,
            author: mpName,
          });
        }
      } catch (e: any) {
        console.log(`   ❌ 失败: ${e.message}`);
      }
    }

    // 4. 输出结果
    console.log('\n📄 抓取结果：');
    console.log('='.repeat(60));

    const result = allArticles.map(a => ({
      title: a.title,
      author: a.author,
      url: a.articleUrl,
      time: a.publishTime,
    }));

    console.log(JSON.stringify(result, null, 2));

    // 5. 保存到文件
    const fs = await import('fs');
    fs.writeFileSync(
      '/Users/liujiahong/cs336/weread-articles.json',
      JSON.stringify(allArticles, null, 2)
    );
    console.log('\n✅ 已保存到 weread-articles.json');

  } catch (error: any) {
    console.error('❌ 抓取失败:', error.message);
  }
}

main();