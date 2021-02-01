$(function () {
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    let layer = layui.layer,
        form = layui.form,
        laypage = layui.laypage
    initTable()
    initCate()
    function initTable() {//获取文章列表并渲染到页面
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败')
                layer.msg(res.message)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    function initCate() {//获取文章分类并渲染到相应的下拉选择框
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败')
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render('select')
            }
        })
    }
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            limits: [2, 3, 5, 10],
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (first !== true) {
                    initTable()
                }
            }
        })
    }
    //筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取下拉选择框的数据
        let cate_id = $('[name="cate_id"]').val()
        let state = $('[name="state"]').val()
        q.cate_id = cate_id
        q.state = state
        //根据最新的数据重新渲染表格
        initTable()
    })
    //删除功能
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')
        let len = $('.btn-delete').length
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success(res) {
                    if (res.status !== 0) return layer.msg('删除文章失败')
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
    //编辑功能
    $('tbody').on('click', '.btn-edit', function () {
        let id = $(this).attr('data-id')
        location.href = '/article/art_pub.html?id=' + id
    })
})