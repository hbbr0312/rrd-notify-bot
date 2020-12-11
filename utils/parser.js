const filter_rrd = (vacationers) => {
    const rrd_departments = ['통합운영팀', 'FX전담팀', '분석설계팀', '개발1팀', '개발2팀', '품질개발팀']
    return vacationers.filter(e => rrd_departments.includes(e[2]))
}

const parse_vacation_type = (content) => {
    if (content.includes('오후')) return '오후 반차'
    else if (content.includes('오전')) return '오전 반차'
    else return '휴가'
}

const convert_to_infomation = (vacationer) => {
    const [name, position, department, vacation_type, delegate] = vacationer
    return `${name} ${position} : ${vacation_type}`
}

const sortfunc = (a, b) => {
    if (a[3] == '휴가') return -1
    else if (a[3] == '오전반차') return 0;
    else return 1
}

const parse = (today_vacationers) => {
    let rrd_vacatiners_info = '부재자가 없습니다.'
    const rrd_vacationers = filter_rrd(today_vacationers)
    if (rrd_vacationers.length > 0) {
        rrd_vacationers.forEach(element => {
            element[3] = parse_vacation_type(element[3])
        });
        rrd_vacationers.sort(sortfunc)
        rrd_vacatiners_info = rrd_vacationers.map(e => convert_to_infomation(e)).join('\n')
    }
    return rrd_vacatiners_info
}

exports.parse = parse
