def qq(self):
    html = _http(self.url)
    vid = re.compile(r'vid:"([^"]+)"').search(html).group(1)
    murl = 'http://vv.video.qq.com/'
    vinfo = _http('%sgetinfo?otype=json&vids=%s' % (murl, vid))
    infoj = json.loads(vinfo.split('=')[1][:-1])
    qtyps = OrderedDict((
        ('1080P', 'fhd'), ('超清', 'shd'), ('高清', 'hd'), ('标清', 'sd')))
    vtyps = {v['name']:v['id'] for v in infoj['fl']['fi']}
    qtypid = vtyps['sd']
    sels = [k for k,v in qtyps.iteritems() if v in vtyps]
    sel = dialog.select('清晰度', sels)
    surls = []
    urlpre = infoj['vl']['vi'][0]['ul']['ui'][-1]['url']
    if sel is not -1:
        qtypid = vtyps[qtyps[sels[sel]]]
    for i in range(1, int(infoj['vl']['vi'][0]['cl']['fc'])):
        fn = '%s.p%s.%s.mp4' % (vid, qtypid%10000, str(i))
        sinfo = _http(
            '{0}getkey?format={1}&filename={2}&vid={3}&otype=json'.format(
                murl, qtypid, fn, vid))
        skey = json.loads(sinfo.split('=')[1][:-1])['key']
        surl = urllib2.urlopen(
            '%s%s?vkey=%s' % (urlpre, fn, skey), timeout=30).geturl()
        if not surl: break
        surls.append(surl)
