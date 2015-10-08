
/**
 * bilibili.tv
 */
var monkey_bili = {
  cid: '',
  title: '',
  oriurl: '',
  appkey: '85eb6835b0a1034e',
  secretkey: '2ad42749773c441109bdc0191257a664',

  run: function() {
    console.log('run() --');
    this.getTitle();
    this.getCid();
  },

  /**
   * Get video title
   */
  getTitle: function() {
    console.log('getTitle()');
    var metas = document.querySelectorAll('meta'),
        meta,
        i;

    for (i = 0; meta = metas[i]; i += 1) {
      if (meta.hasAttribute('name') &&
          meta.getAttribute('name') === 'title') {
        this.title = meta.getAttribute('content');
        return;
      }
    }
    this.title = document.title;
  },

  /**
   * 获取 content ID.
   */
  getCid: function() {
    console.log('getCid()');
    var scripts = document.querySelectorAll('script'),
        reg = /cid=(\d+)&aid=(\d+)/,
        match,
        i;
    for (i = 0; i < scripts.length; i++) {
      match = reg.exec(scripts[i].innerHTML);
      console.log('match:', match);
      if (match && match.length === 3) {
        this.cid = match[1];
        this.getVideos();
        return;
      }
    } 
    //console.error('Failed to get cid!');
  },

  /**
   * Get original video links from interface.bilibili.cn
   */
  getVideos: function() {
    console.log('getVideos() -- ');
    var sign = this.
        url = [
          'http://interface.bilibili.cn/playurl?',
          'appkey=', this.appkey,
          '&cid=', this.cid,
          '&sign=', sign,
        ],
        that = this;

    console.log('url:', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var reg = /<oriurl>(.+)<\/oriurl>/g,
            txt = response.responseText,
            match = reg.exec(txt);

        console.log('oriurl match:', match);
        if (match && match.length === 2) {
          that.oriurl = match[1];
          that.createUI();
        } else {
          console.error('Failed to get oriurl');
        }
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: '视频的原始地址',
          formats: [''],
          links: [],
          ok: true,
          msg: '',
        };

    videos.formats.push('');
    videos.links.push(this.oriurl);

    singleFile.run(videos);
  },
}

monkey.extend('www.bilibili.com', [
  'http://www.bilibili.com/video/av',
], monkey_bili);

