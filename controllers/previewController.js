/** @module apiController */
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const URL = require('url');

const request = require('request');
const cheerio = require('cheerio');
module.exports = {
    index: async ((req, res) => {
        var url = 'https://www.formula1.com/en/latest.html';
        if (!url) {
            let error = "No url found"
            res.status(200).json(error)
            return
        }
        let tempUrl = URL.parse(url)
        var options = {
            url: url,
            headers: {
                'User-Agent': 'MacoS',
                'Accept': 'text/html'
            }
        }

        var crawled = {
            link: url,
            title: null,
            description: null,
            image: null
        }

        await (request(options, function (error, response, body) {
            if (error || response.statusCode != 200) {
                res.status(200).send(crawled)
                return
            }

            var $ = cheerio.load(body)

            var pic = $('.group.article-columns.article-level3 .column.column-4 figure img:last-child')
            var headings = $('.group.article-columns.article-level3 .column.column-4 .teaser-info h4')
            var time = $('.group.article-columns.article-level3 .column.column-4 .teaser-info p.teaser-date')
            var level3 = []
            headings.each(function(i, element){
                level3.push({
                    heading: $(element).html(),
                    pic: tempUrl.host+$(pic[i]).attr('src'),
                    time: $(time[i]).text().trim()
                })
            })

            var pic = $('.group.article-columns.article-level2 .column.column-2 figure img:last-child')
            var headings = $('.group.article-columns.article-level2 .column.column-2 .teaser-info h4')
            var time = $('.group.article-columns.article-level2 .column.column-2 .teaser-info p.teaser-date')
            var level2 = []
            headings.each(function(i, element){
                level2.push({
                    heading: $(element).html(),
                    pic: tempUrl.host+$(pic[i]).attr('src'),
                    time: $(time[i]).text().trim()
                })
            })

            var pic = $('.group.article-columns.article-level4 .column.column-2 figure img:last-child')
            var headings = $('.group.article-columns.article-level4 .column.column-2 .teaser-info h4')
            var time = $('.group.article-columns.article-level4 .column.column-2 .teaser-info p.teaser-date')
            var level4 = []
            headings.each(function(i, element){
                level4.push({
                    heading: $(element).html(),
                    pic: tempUrl.host+$(pic[i]).attr('src'),
                    time: $(time[i]).text().trim()
                })
            })


            var pic = $('.group.article-columns.article-columns .column.column-2 figure img:last-child')
            var headings = $('.group.article-columns.article-columns .column.column-2 .teaser-info h4')
            var time = $('.group.article-columns.article-columns .column.column-2 .teaser-info p.teaser-date')
            var level4 = []
            headings.each(function(i, element){
                level4.push({
                    heading: $(element).html(),
                    pic: tempUrl.host+$(pic[i]).attr('src'),
                    time: $(time[i]).text().trim()
                })
            })


            obj = {
                topHeadings: level3,
                topHeadings2: level2,
                secondLevelHeadings: level4
            }


            res.status(200).send(obj)
            return
        }))
    })
}