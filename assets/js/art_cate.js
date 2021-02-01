$(function () {
    initArtCateList()
    let layer = layui.layer
    let form = layui.form
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    let indexAdd = null//新增弹出层索引
    //添加文章分类
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    //提交新增分类
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg('添加分类失败!')
                initArtCateList()
                layer.msg('添加分类成功')
                //根据索引关闭相应的弹出层
                layer.close(indexAdd)
            }
        })
    })
    //编辑功能
    let indexEdit = null//编辑弹出层索引
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        let id = $(this).attr('data-id')
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success(res) {
                form.val('form-edit', res.data)
                // console.log(res.data);
            }
        })
    })
    //更新文章分类
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg('更新分类信息失败！')
                layer.msg('更新分类信息成功!')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    //删除文章分类
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success(res) {
                    if (res.status !== 0) return layer.msg('删除文章分类失败!')
                    layer.msg('删除文章成功!')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})