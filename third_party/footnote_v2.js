!(() => {
  // console.clear()

  var ttFnSel = d3.select('html').selectAppend('div.tooltip-footnote.tooltip-footnote-hidden')

  var key2cite = {}
  var footendSel = d3.selectAll('.footend')

  footendSel
    .each(function(d, i){
      var ppIndex = i + 1
      var sel = d3.select(this)
      var key = sel.attr('key')

      key2cite[key] = {ppIndex, key, ogHTML: sel.parent().html()}
      sel
        .at({href: '#footstart-' + key, id: 'footend-' + key})
        .text(ppIndex + '. ')
    })

  footendSel.parent()
    .classed('footend-content', 1)

  var footstartSel = d3.selectAll('.footstart')
    .each(function(d, i){
      var sel = d3.select(this)
      var keys = sel.attr('key').split(' ')
      var key = keys[0]

      var cites = keys
        .map(key => key2cite[key] || console.log('missing key', key))
        .filter(d => d)

      d3.select(this)
        .at({href: '#footend-' + key, id: 'footstart-' + key})
        .text(cites.map(d => d.ppIndex).join(', '))
        .datum(cites)
        .parent()
        .parent().classed('footstart-p', 1)
    })
    .call(addLockedTooltip)

  function addLockedTooltip(sel, opts={}){
    sel
      .on('mouseover', function(cites, i){
        ttFnSel.html('')
          .classed('tooltip-footnote-hidden', 0)
          .appendMany('div', cites).st({marginBottom: 5})
          .html(d => d.ogHTML)

        ttFnSel.select('.footend').remove()
        if (opts.noHover) ttFnSel.style('pointer-events', 'none', 'important')

        var [x, y] = d3.mouse(d3.select('html').node())
        var bb = ttFnSel.node().getBoundingClientRect(),
            left = d3.clamp(20, (x-bb.width/2), window.innerWidth - bb.width - 20),
            top = innerHeight + scrollY > y + 20 + bb.height ? y + 20 : y - bb.height - 10;

        ttFnSel.st({left, top})
      })
      .on('mousemove', mousemove)
      .on('mouseout', mouseout)

    ttFnSel
      .on('mousemove', mousemove)
      .on('mouseout', mouseout)

    function mousemove(){
      if (window.__ttfade) window.__ttfade.stop()
    }

    function mouseout(){
      if (window.__ttfade) window.__ttfade.stop()
      window.__ttfade = d3.timeout(
        () => ttFnSel.classed('tooltip-footnote-hidden', 1).st({pointerEvents: ''}),
        250
      )
    }
  }

  window.addLockedTooltip = addLockedTooltip

})()


