'reach 0.1'
export const main = Reach.App(() => {
    const Creator = Participant('Creator', {
        get_num: UInt,
        get_token: Token
    })
    const player1 = Participant('player1', {
        Accepttok: Fun([Token], Null),
        guess_num: UInt
    })
    const player2 = Participant('player2', {
        Accepttok: Fun([Token], Null),
        guess_num: UInt
    })
    init()
    Creator.only(() => {
        const getnum = declassify(interact.get_num)
        const gettoken = declassify(interact.get_token)
    })
    Creator.publish(getnum, gettoken)
    const tokenpay = [[1, gettoken]]
    commit()
    player1.only(() => {
        const player1_accepttok = declassify(interact.Accepttok(gettoken))
        const guessnump1 = declassify(interact.guess_num)
    })
    player1.publish(player1_accepttok, guessnump1)
    commit()

    player2.only(() => {
        const player2_accepttok = declassify(interact.Accepttok(gettoken))
        const guessnump2 = declassify(interact.guess_num)
    })
    player2.publish(player2_accepttok, guessnump2)
    const whitelist = new Set()
    const getaddress =
        guessnump1 == getnum ? player1 :
            guessnump2 == getnum ? player2 :
                Creator
    whitelist.insert(getaddress)
    commit()
    Creator.pay(tokenpay)
    transfer(tokenpay).to(getaddress)
    commit()
})
