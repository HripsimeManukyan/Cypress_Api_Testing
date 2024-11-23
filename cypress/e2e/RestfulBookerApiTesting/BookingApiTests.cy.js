import {faker} from '@faker-js/faker'

describe('RestfulBooker API Tests', () => {
    let token
    let bookingId
    let firstName
    let lastName

    const baseUrl = Cypress.env('apiUrl')
    const endpoints = Cypress.env('endpoints')

    const authBody = {
        username: 'admin',
        password: 'password123'
    }

    const bookingBody = {
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-05'
        },
        additionalneeds: 'Breakfast'
    }

    it('Create Authentication Token', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}${endpoints.auth}`,
            body: authBody
        }).then((response) => {
            token = response.body.token
            expect(response.status).to.eql(200)
            expect(response.body).to.have.property('token')
        })
    })

    it('Create Booking with Random Names', () => {

        firstName = faker.person.firstName()
        lastName = faker.person.lastName()

        cy.request({
            method: 'POST',
            url: `${baseUrl}${endpoints.booking}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                ...bookingBody,
                firstname: firstName,
                lastname: lastName
            }
        }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.booking.firstname).to.eq(firstName)
            expect(response.body.booking.lastname).to.eq(lastName)
            expect(response.body.booking).to.have.property('firstname')
            expect(response.body.booking).to.have.property('lastname')
            bookingId = response.body.bookingid
        })
    })

    it('Get Booking Details', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}${endpoints.booking}/${bookingId}`
        }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.firstname).to.eq(firstName)
            expect(response.body.lastname).to.eq(lastName)
            expect(response.body.additionalneeds).to.eq('Breakfast')
        })
    })
})

