const RRD_TEAMS = process.env.RRD_TEAMS

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

const parse = (psVacationers) => {
    let rrdVacationerInfo = '부재자가 없습니다.'
    const rrdVactioners = filterRRD(psVacationers)
    if (rrdVactioners.length > 0) {
        rrdVactioners.forEach(e => {
            e[3] = parseVacationType(e[3])
        });
        const dayOff = rrdVactioners.filter(e => e[3] == '휴가')
        const mrOff = rrdVactioners.filter(e => e[3].includes('오전'))
        const anOff = rrdVactioners.filter(e => e[3].includes('오후'))
        const sorted_vacationers = dayOff.concat(mrOff).concat(anOff)
        rrdVacationerInfo = sorted_vacationers.map(e => getInfoText(e)).join('\n')
    }
    return rrdVacationerInfo
}

exports.parse = parse
