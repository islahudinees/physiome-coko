const logger = require('workflow-utils/logger-with-prefix')('PhysiomeWorkflowTasks/Email-ManuscriptAcceptance');

module.exports = function _setupEmailPaymentReceivedTask(client) {

    client.subscribe('payment-received-email', async ({ task, taskService }) => {

        // Note: this task doesn't currently send an email message, but has been implemented in place
        // in case an email does need to be sent in the future.

        // Note: if paymentSkipped == true, then we do not want to send this email either.

        logger.debug(`send payment received email task is starting`);
        logger.debug(`send payment received email task has completed`);
        return taskService.complete(task);
    });
};
