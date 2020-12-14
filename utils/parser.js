const RRD_TEAMS = process.env.RRD_TEAMS //|| '통합운영팀,FX전담팀,분석설계팀,개발1팀,개발2팀,품질개발팀'

const filterRRD = (vacationers) => {
    const rrdTeams = RRD_TEAMS.split(',')
    return vacationers.filter(e => rrdTeams.includes(e[2]))
}

const parseVacationType = (content) => {
    if (content.includes('오후')) return '오후 반차'
    else if (content.includes('오전')) return '오전 반차'
    else return '휴가'
}

const getInfoText = (vacationer) => {
    const [name, position, teamName, vacation_type, delegate] = vacationer
    return `${name} ${position} : ${vacation_type}`
}

const descendingVacationTime = (a, b) => {
    if (a[3] == '휴가') return -1
    else if (a[3] == '오전반차') return 0;
    else return 1
}

const parse = (psVacationers) => {
    let rrdVacationerInfo = '부재자가 없습니다.'
    const rrdVactioners = filterRRD(psVacationers)
    if (rrdVactioners.length > 0) {
        rrdVactioners.forEach(e => {
            e[3] = parseVacationType(e[3])
        });
        rrdVactioners.sort(descendingVacationTime)
        rrdVacationerInfo = rrdVactioners.map(e => getInfoText(e)).join('\n')
    }
    return rrdVacationerInfo
}

exports.parse = parse
