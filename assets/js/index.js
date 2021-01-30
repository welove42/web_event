$(function () {
    let layer = layui.layer
    getUserInfo()
    $('#btn-logout').on('click', function () {
        layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index)
        })
    })
})
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        }
    })
}
function renderAvatar(user) {
    let name = user.nickname || user.username
    $('#welcome').html('欢迎！&nbsp;&nbsp' + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
        return
    }
    $('.layui-nav-img').hide()
    let firstWord = name[0].toUpperCase()
    $('.text-avatar')
        .html(firstWord)
        .show()
}