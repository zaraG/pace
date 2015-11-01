/* jshint node: true */
'use strict';

var router = require('express').Router();
var participants = require('../service/participants');
var accesscontrol = require("../acl/accesscontrol");
var isAuthenticated = require("../acl/authentication");

var canConfirmPayments = accesscontrol.hasPermissionTo('admin', 'confirm payments');

router.get('/', isAuthenticated, function (req, res) {
    if(canConfirmPayments) {
        res.render('paymentValidation/paymentValidation', {});
    } else {
        var result = {
            message: 'Bitte anmelden',
            error: {
                status: 'Nur Administratoren können diese Seite einsehen'
            }
        };
        res.render('error', result);
    }
});

router.post('/', isAuthenticated, function(req, res) {
    if(canConfirmPayments) {
        var paymentToken = req.body.paymenttoken;

        participants.getByToken(paymentToken)
            .then(function (result) {
                return res.render('paymentValidation/paymentValidation', {
                    token: paymentToken,
                    name: result.name,
                    amount: result.amount,
                    participantid: result.id
                });
            })
            .catch(function (result) {
                return res.render('paymentValidation/paymentValidation', {
                    token: paymentToken,
                    error: result.error
                });
            });
    }
});

router.post('/confirm', isAuthenticated, function(req, res) {
    if(canConfirmPayments) {
        participants.confirmParticipant(req.body.participantid)
            .then(function () {
                res.render('paymentValidation/paymentValidation', {
                    success_message: "Der Teilnehmer wurde bestätigt",
                    token: req.body.paymenttoken,
                    name: req.body.name,
                    amount: req.body.amount,
                    participantid: req.body.participantid
                });
            })
            .catch(function () {
                res.render('paymentValidation/paymentValidation', {
                    error: "Fehler: Der Teilnehmer konnte nicht bestätigt werden",
                    token: req.body.paymenttoken,
                    name: req.body.name,
                    amount: req.body.amount,
                    participantid: req.body.participantid
                });
            });
    }
});

module.exports = router;

