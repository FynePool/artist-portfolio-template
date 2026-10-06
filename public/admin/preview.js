var ExhibitionPreview = createClass({
  render: function () {
    var entry    = this.props.entry;
    var getAsset = this.props.getAsset;

    var title       = entry.getIn(['data', 'title'])         || '';
    var subtitle    = entry.getIn(['data', 'subtitle'])      || '';
    var description = entry.getIn(['data', 'description'])   || '';
    var imagePos    = entry.getIn(['data', 'imagePosition']) || 'left';
    var linkText    = entry.getIn(['data', 'link', 'text']) || '';
    var linkUrl     = entry.getIn(['data', 'link', 'url'])  || '';
    var linkNewTab  = entry.getIn(['data', 'link', 'newTab']);
    var imagesRaw   = entry.getIn(['data', 'images']);
    var imgList     = imagesRaw ? imagesRaw.toJS() : [];
    var imgSrcs = imgList.map(function(f) { return getAsset(f).toString(); });

    return h('article', { className: 'preview-article' + (imagePos === 'right' ? ' right' : '') },
      h('div', { className: 'preview-image-block' },
        imgSrcs.length
          ? imgSrcs.map(function(src, i) { return h('img', { key: i, src: src, alt: title }); })
          : h('div', { className: 'preview-image-placeholder' }, 'Nessuna immagine')
      ),
      h('div', { className: 'preview-text-block' },
        h('h2', { className: 'preview-title' }, title || '—'),
        subtitle    ? h('p', { className: 'preview-subtitle' }, subtitle)    : null,
        description ? h('p', { className: 'preview-desc' },    description) : null,
        linkText && linkUrl
          ? h('a', { className: 'preview-cta', href: linkUrl, target: linkNewTab ? '_blank' : '_self', rel: 'noopener noreferrer' }, linkText)
          : null
      )
    );
  }
});

CMS.registerPreviewStyle('/admin/preview.css');
CMS.registerPreviewTemplate('exhibitions', ExhibitionPreview);
CMS.registerPreviewTemplate('articles', ExhibitionPreview);
