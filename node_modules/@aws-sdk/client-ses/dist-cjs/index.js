'use strict';

var middlewareHostHeader = require('@aws-sdk/middleware-host-header');
var middlewareLogger = require('@aws-sdk/middleware-logger');
var middlewareRecursionDetection = require('@aws-sdk/middleware-recursion-detection');
var middlewareUserAgent = require('@aws-sdk/middleware-user-agent');
var configResolver = require('@smithy/config-resolver');
var core = require('@smithy/core');
var middlewareContentLength = require('@smithy/middleware-content-length');
var middlewareEndpoint = require('@smithy/middleware-endpoint');
var middlewareRetry = require('@smithy/middleware-retry');
var smithyClient = require('@smithy/smithy-client');
var httpAuthSchemeProvider = require('./auth/httpAuthSchemeProvider');
var runtimeConfig = require('./runtimeConfig');
var regionConfigResolver = require('@aws-sdk/region-config-resolver');
var protocolHttp = require('@smithy/protocol-http');
var middlewareSerde = require('@smithy/middleware-serde');
var core$1 = require('@aws-sdk/core');
var utilWaiter = require('@smithy/util-waiter');

const resolveClientEndpointParameters = (options) => {
    return Object.assign(options, {
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "ses",
    });
};
const commonParams = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
};

const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
    const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
    let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
    let _credentials = runtimeConfig.credentials;
    return {
        setHttpAuthScheme(httpAuthScheme) {
            const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
            if (index === -1) {
                _httpAuthSchemes.push(httpAuthScheme);
            }
            else {
                _httpAuthSchemes.splice(index, 1, httpAuthScheme);
            }
        },
        httpAuthSchemes() {
            return _httpAuthSchemes;
        },
        setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
            _httpAuthSchemeProvider = httpAuthSchemeProvider;
        },
        httpAuthSchemeProvider() {
            return _httpAuthSchemeProvider;
        },
        setCredentials(credentials) {
            _credentials = credentials;
        },
        credentials() {
            return _credentials;
        },
    };
};
const resolveHttpAuthRuntimeConfig = (config) => {
    return {
        httpAuthSchemes: config.httpAuthSchemes(),
        httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
        credentials: config.credentials(),
    };
};

const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
    const extensionConfiguration = Object.assign(regionConfigResolver.getAwsRegionExtensionConfiguration(runtimeConfig), smithyClient.getDefaultExtensionConfiguration(runtimeConfig), protocolHttp.getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
    extensions.forEach((extension) => extension.configure(extensionConfiguration));
    return Object.assign(runtimeConfig, regionConfigResolver.resolveAwsRegionExtensionConfiguration(extensionConfiguration), smithyClient.resolveDefaultRuntimeConfig(extensionConfiguration), protocolHttp.resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

class SESClient extends smithyClient.Client {
    config;
    constructor(...[configuration]) {
        const _config_0 = runtimeConfig.getRuntimeConfig(configuration || {});
        super(_config_0);
        this.initConfig = _config_0;
        const _config_1 = resolveClientEndpointParameters(_config_0);
        const _config_2 = middlewareUserAgent.resolveUserAgentConfig(_config_1);
        const _config_3 = middlewareRetry.resolveRetryConfig(_config_2);
        const _config_4 = configResolver.resolveRegionConfig(_config_3);
        const _config_5 = middlewareHostHeader.resolveHostHeaderConfig(_config_4);
        const _config_6 = middlewareEndpoint.resolveEndpointConfig(_config_5);
        const _config_7 = httpAuthSchemeProvider.resolveHttpAuthSchemeConfig(_config_6);
        const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
        this.config = _config_8;
        this.middlewareStack.use(middlewareUserAgent.getUserAgentPlugin(this.config));
        this.middlewareStack.use(middlewareRetry.getRetryPlugin(this.config));
        this.middlewareStack.use(middlewareContentLength.getContentLengthPlugin(this.config));
        this.middlewareStack.use(middlewareHostHeader.getHostHeaderPlugin(this.config));
        this.middlewareStack.use(middlewareLogger.getLoggerPlugin(this.config));
        this.middlewareStack.use(middlewareRecursionDetection.getRecursionDetectionPlugin(this.config));
        this.middlewareStack.use(core.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
            httpAuthSchemeParametersProvider: httpAuthSchemeProvider.defaultSESHttpAuthSchemeParametersProvider,
            identityProviderConfigProvider: async (config) => new core.DefaultIdentityProviderConfig({
                "aws.auth#sigv4": config.credentials,
            }),
        }));
        this.middlewareStack.use(core.getHttpSigningPlugin(this.config));
    }
    destroy() {
        super.destroy();
    }
}

class SESServiceException extends smithyClient.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SESServiceException.prototype);
    }
}

class AccountSendingPausedException extends SESServiceException {
    name = "AccountSendingPausedException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "AccountSendingPausedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, AccountSendingPausedException.prototype);
    }
}
class AlreadyExistsException extends SESServiceException {
    name = "AlreadyExistsException";
    $fault = "client";
    Name;
    constructor(opts) {
        super({
            name: "AlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, AlreadyExistsException.prototype);
        this.Name = opts.Name;
    }
}
const BehaviorOnMXFailure = {
    RejectMessage: "RejectMessage",
    UseDefaultValue: "UseDefaultValue",
};
const BounceType = {
    ContentRejected: "ContentRejected",
    DoesNotExist: "DoesNotExist",
    ExceededQuota: "ExceededQuota",
    MessageTooLarge: "MessageTooLarge",
    TemporaryFailure: "TemporaryFailure",
    Undefined: "Undefined",
};
const DsnAction = {
    DELAYED: "delayed",
    DELIVERED: "delivered",
    EXPANDED: "expanded",
    FAILED: "failed",
    RELAYED: "relayed",
};
const BulkEmailStatus = {
    AccountDailyQuotaExceeded: "AccountDailyQuotaExceeded",
    AccountSendingPaused: "AccountSendingPaused",
    AccountSuspended: "AccountSuspended",
    AccountThrottled: "AccountThrottled",
    ConfigurationSetDoesNotExist: "ConfigurationSetDoesNotExist",
    ConfigurationSetSendingPaused: "ConfigurationSetSendingPaused",
    Failed: "Failed",
    InvalidParameterValue: "InvalidParameterValue",
    InvalidSendingPoolName: "InvalidSendingPoolName",
    MailFromDomainNotVerified: "MailFromDomainNotVerified",
    MessageRejected: "MessageRejected",
    Success: "Success",
    TemplateDoesNotExist: "TemplateDoesNotExist",
    TransientFailure: "TransientFailure",
};
class CannotDeleteException extends SESServiceException {
    name = "CannotDeleteException";
    $fault = "client";
    Name;
    constructor(opts) {
        super({
            name: "CannotDeleteException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CannotDeleteException.prototype);
        this.Name = opts.Name;
    }
}
class LimitExceededException extends SESServiceException {
    name = "LimitExceededException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "LimitExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, LimitExceededException.prototype);
    }
}
class RuleSetDoesNotExistException extends SESServiceException {
    name = "RuleSetDoesNotExistException";
    $fault = "client";
    Name;
    constructor(opts) {
        super({
            name: "RuleSetDoesNotExistException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, RuleSetDoesNotExistException.prototype);
        this.Name = opts.Name;
    }
}
const DimensionValueSource = {
    EMAIL_HEADER: "emailHeader",
    LINK_TAG: "linkTag",
    MESSAGE_TAG: "messageTag",
};
class ConfigurationSetAlreadyExistsException extends SESServiceException {
    name = "ConfigurationSetAlreadyExistsException";
    $fault = "client";
    ConfigurationSetName;
    constructor(opts) {
        super({
            name: "ConfigurationSetAlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ConfigurationSetAlreadyExistsException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
    }
}
const ConfigurationSetAttribute = {
    DELIVERY_OPTIONS: "deliveryOptions",
    EVENT_DESTINATIONS: "eventDestinations",
    REPUTATION_OPTIONS: "reputationOptions",
    TRACKING_OPTIONS: "trackingOptions",
};
class ConfigurationSetDoesNotExistException extends SESServiceException {
    name = "ConfigurationSetDoesNotExistException";
    $fault = "client";
    ConfigurationSetName;
    constructor(opts) {
        super({
            name: "ConfigurationSetDoesNotExistException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ConfigurationSetDoesNotExistException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
    }
}
class ConfigurationSetSendingPausedException extends SESServiceException {
    name = "ConfigurationSetSendingPausedException";
    $fault = "client";
    ConfigurationSetName;
    constructor(opts) {
        super({
            name: "ConfigurationSetSendingPausedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ConfigurationSetSendingPausedException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
    }
}
class InvalidConfigurationSetException extends SESServiceException {
    name = "InvalidConfigurationSetException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidConfigurationSetException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidConfigurationSetException.prototype);
    }
}
const EventType = {
    BOUNCE: "bounce",
    CLICK: "click",
    COMPLAINT: "complaint",
    DELIVERY: "delivery",
    OPEN: "open",
    REJECT: "reject",
    RENDERING_FAILURE: "renderingFailure",
    SEND: "send",
};
class EventDestinationAlreadyExistsException extends SESServiceException {
    name = "EventDestinationAlreadyExistsException";
    $fault = "client";
    ConfigurationSetName;
    EventDestinationName;
    constructor(opts) {
        super({
            name: "EventDestinationAlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, EventDestinationAlreadyExistsException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
        this.EventDestinationName = opts.EventDestinationName;
    }
}
class InvalidCloudWatchDestinationException extends SESServiceException {
    name = "InvalidCloudWatchDestinationException";
    $fault = "client";
    ConfigurationSetName;
    EventDestinationName;
    constructor(opts) {
        super({
            name: "InvalidCloudWatchDestinationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidCloudWatchDestinationException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
        this.EventDestinationName = opts.EventDestinationName;
    }
}
class InvalidFirehoseDestinationException extends SESServiceException {
    name = "InvalidFirehoseDestinationException";
    $fault = "client";
    ConfigurationSetName;
    EventDestinationName;
    constructor(opts) {
        super({
            name: "InvalidFirehoseDestinationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidFirehoseDestinationException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
        this.EventDestinationName = opts.EventDestinationName;
    }
}
class InvalidSNSDestinationException extends SESServiceException {
    name = "InvalidSNSDestinationException";
    $fault = "client";
    ConfigurationSetName;
    EventDestinationName;
    constructor(opts) {
        super({
            name: "InvalidSNSDestinationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidSNSDestinationException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
        this.EventDestinationName = opts.EventDestinationName;
    }
}
class InvalidTrackingOptionsException extends SESServiceException {
    name = "InvalidTrackingOptionsException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidTrackingOptionsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidTrackingOptionsException.prototype);
    }
}
class TrackingOptionsAlreadyExistsException extends SESServiceException {
    name = "TrackingOptionsAlreadyExistsException";
    $fault = "client";
    ConfigurationSetName;
    constructor(opts) {
        super({
            name: "TrackingOptionsAlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TrackingOptionsAlreadyExistsException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
    }
}
class CustomVerificationEmailInvalidContentException extends SESServiceException {
    name = "CustomVerificationEmailInvalidContentException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "CustomVerificationEmailInvalidContentException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CustomVerificationEmailInvalidContentException.prototype);
    }
}
class CustomVerificationEmailTemplateAlreadyExistsException extends SESServiceException {
    name = "CustomVerificationEmailTemplateAlreadyExistsException";
    $fault = "client";
    CustomVerificationEmailTemplateName;
    constructor(opts) {
        super({
            name: "CustomVerificationEmailTemplateAlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CustomVerificationEmailTemplateAlreadyExistsException.prototype);
        this.CustomVerificationEmailTemplateName = opts.CustomVerificationEmailTemplateName;
    }
}
class FromEmailAddressNotVerifiedException extends SESServiceException {
    name = "FromEmailAddressNotVerifiedException";
    $fault = "client";
    FromEmailAddress;
    constructor(opts) {
        super({
            name: "FromEmailAddressNotVerifiedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, FromEmailAddressNotVerifiedException.prototype);
        this.FromEmailAddress = opts.FromEmailAddress;
    }
}
const ReceiptFilterPolicy = {
    Allow: "Allow",
    Block: "Block",
};
const InvocationType = {
    Event: "Event",
    RequestResponse: "RequestResponse",
};
const SNSActionEncoding = {
    Base64: "Base64",
    UTF8: "UTF-8",
};
const StopScope = {
    RULE_SET: "RuleSet",
};
const TlsPolicy = {
    Optional: "Optional",
    Require: "Require",
};
class InvalidLambdaFunctionException extends SESServiceException {
    name = "InvalidLambdaFunctionException";
    $fault = "client";
    FunctionArn;
    constructor(opts) {
        super({
            name: "InvalidLambdaFunctionException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidLambdaFunctionException.prototype);
        this.FunctionArn = opts.FunctionArn;
    }
}
class InvalidS3ConfigurationException extends SESServiceException {
    name = "InvalidS3ConfigurationException";
    $fault = "client";
    Bucket;
    constructor(opts) {
        super({
            name: "InvalidS3ConfigurationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidS3ConfigurationException.prototype);
        this.Bucket = opts.Bucket;
    }
}
class InvalidSnsTopicException extends SESServiceException {
    name = "InvalidSnsTopicException";
    $fault = "client";
    Topic;
    constructor(opts) {
        super({
            name: "InvalidSnsTopicException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidSnsTopicException.prototype);
        this.Topic = opts.Topic;
    }
}
class RuleDoesNotExistException extends SESServiceException {
    name = "RuleDoesNotExistException";
    $fault = "client";
    Name;
    constructor(opts) {
        super({
            name: "RuleDoesNotExistException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, RuleDoesNotExistException.prototype);
        this.Name = opts.Name;
    }
}
class InvalidTemplateException extends SESServiceException {
    name = "InvalidTemplateException";
    $fault = "client";
    TemplateName;
    constructor(opts) {
        super({
            name: "InvalidTemplateException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidTemplateException.prototype);
        this.TemplateName = opts.TemplateName;
    }
}
const CustomMailFromStatus = {
    Failed: "Failed",
    Pending: "Pending",
    Success: "Success",
    TemporaryFailure: "TemporaryFailure",
};
class CustomVerificationEmailTemplateDoesNotExistException extends SESServiceException {
    name = "CustomVerificationEmailTemplateDoesNotExistException";
    $fault = "client";
    CustomVerificationEmailTemplateName;
    constructor(opts) {
        super({
            name: "CustomVerificationEmailTemplateDoesNotExistException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CustomVerificationEmailTemplateDoesNotExistException.prototype);
        this.CustomVerificationEmailTemplateName = opts.CustomVerificationEmailTemplateName;
    }
}
class EventDestinationDoesNotExistException extends SESServiceException {
    name = "EventDestinationDoesNotExistException";
    $fault = "client";
    ConfigurationSetName;
    EventDestinationName;
    constructor(opts) {
        super({
            name: "EventDestinationDoesNotExistException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, EventDestinationDoesNotExistException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
        this.EventDestinationName = opts.EventDestinationName;
    }
}
class TrackingOptionsDoesNotExistException extends SESServiceException {
    name = "TrackingOptionsDoesNotExistException";
    $fault = "client";
    ConfigurationSetName;
    constructor(opts) {
        super({
            name: "TrackingOptionsDoesNotExistException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TrackingOptionsDoesNotExistException.prototype);
        this.ConfigurationSetName = opts.ConfigurationSetName;
    }
}
const VerificationStatus = {
    Failed: "Failed",
    NotStarted: "NotStarted",
    Pending: "Pending",
    Success: "Success",
    TemporaryFailure: "TemporaryFailure",
};
class TemplateDoesNotExistException extends SESServiceException {
    name = "TemplateDoesNotExistException";
    $fault = "client";
    TemplateName;
    constructor(opts) {
        super({
            name: "TemplateDoesNotExistException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TemplateDoesNotExistException.prototype);
        this.TemplateName = opts.TemplateName;
    }
}
const IdentityType = {
    Domain: "Domain",
    EmailAddress: "EmailAddress",
};
class InvalidDeliveryOptionsException extends SESServiceException {
    name = "InvalidDeliveryOptionsException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidDeliveryOptionsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidDeliveryOptionsException.prototype);
    }
}
class InvalidPolicyException extends SESServiceException {
    name = "InvalidPolicyException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidPolicyException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidPolicyException.prototype);
    }
}
class InvalidRenderingParameterException extends SESServiceException {
    name = "InvalidRenderingParameterException";
    $fault = "client";
    TemplateName;
    constructor(opts) {
        super({
            name: "InvalidRenderingParameterException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidRenderingParameterException.prototype);
        this.TemplateName = opts.TemplateName;
    }
}
class MailFromDomainNotVerifiedException extends SESServiceException {
    name = "MailFromDomainNotVerifiedException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "MailFromDomainNotVerifiedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, MailFromDomainNotVerifiedException.prototype);
    }
}
class MessageRejected extends SESServiceException {
    name = "MessageRejected";
    $fault = "client";
    constructor(opts) {
        super({
            name: "MessageRejected",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, MessageRejected.prototype);
    }
}
class MissingRenderingAttributeException extends SESServiceException {
    name = "MissingRenderingAttributeException";
    $fault = "client";
    TemplateName;
    constructor(opts) {
        super({
            name: "MissingRenderingAttributeException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, MissingRenderingAttributeException.prototype);
        this.TemplateName = opts.TemplateName;
    }
}
const NotificationType = {
    Bounce: "Bounce",
    Complaint: "Complaint",
    Delivery: "Delivery",
};
class ProductionAccessNotGrantedException extends SESServiceException {
    name = "ProductionAccessNotGrantedException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ProductionAccessNotGrantedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ProductionAccessNotGrantedException.prototype);
    }
}

const se_CloneReceiptRuleSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CloneReceiptRuleSetRequest(input),
        [_A]: _CRRS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_CreateConfigurationSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CreateConfigurationSetRequest(input),
        [_A]: _CCS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_CreateConfigurationSetEventDestinationCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CreateConfigurationSetEventDestinationRequest(input),
        [_A]: _CCSED,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_CreateConfigurationSetTrackingOptionsCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CreateConfigurationSetTrackingOptionsRequest(input),
        [_A]: _CCSTO,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_CreateCustomVerificationEmailTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CreateCustomVerificationEmailTemplateRequest(input),
        [_A]: _CCVET,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_CreateReceiptFilterCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CreateReceiptFilterRequest(input),
        [_A]: _CRF,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_CreateReceiptRuleCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CreateReceiptRuleRequest(input),
        [_A]: _CRR,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_CreateReceiptRuleSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CreateReceiptRuleSetRequest(input),
        [_A]: _CRRSr,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_CreateTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_CreateTemplateRequest(input),
        [_A]: _CT,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteConfigurationSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteConfigurationSetRequest(input),
        [_A]: _DCS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteConfigurationSetEventDestinationCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteConfigurationSetEventDestinationRequest(input),
        [_A]: _DCSED,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteConfigurationSetTrackingOptionsCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteConfigurationSetTrackingOptionsRequest(input),
        [_A]: _DCSTO,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteCustomVerificationEmailTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteCustomVerificationEmailTemplateRequest(input),
        [_A]: _DCVET,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteIdentityCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteIdentityRequest(input),
        [_A]: _DI,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteIdentityPolicyCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteIdentityPolicyRequest(input),
        [_A]: _DIP,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteReceiptFilterCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteReceiptFilterRequest(input),
        [_A]: _DRF,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteReceiptRuleCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteReceiptRuleRequest(input),
        [_A]: _DRR,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteReceiptRuleSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteReceiptRuleSetRequest(input),
        [_A]: _DRRS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteTemplateRequest(input),
        [_A]: _DT,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DeleteVerifiedEmailAddressCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DeleteVerifiedEmailAddressRequest(input),
        [_A]: _DVEA,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DescribeActiveReceiptRuleSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DescribeActiveReceiptRuleSetRequest(),
        [_A]: _DARRS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DescribeConfigurationSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DescribeConfigurationSetRequest(input),
        [_A]: _DCSe,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DescribeReceiptRuleCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DescribeReceiptRuleRequest(input),
        [_A]: _DRRe,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_DescribeReceiptRuleSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_DescribeReceiptRuleSetRequest(input),
        [_A]: _DRRSe,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetAccountSendingEnabledCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    const body = buildFormUrlencodedString({
        [_A]: _GASE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetCustomVerificationEmailTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_GetCustomVerificationEmailTemplateRequest(input),
        [_A]: _GCVET,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetIdentityDkimAttributesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_GetIdentityDkimAttributesRequest(input),
        [_A]: _GIDA,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetIdentityMailFromDomainAttributesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_GetIdentityMailFromDomainAttributesRequest(input),
        [_A]: _GIMFDA,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetIdentityNotificationAttributesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_GetIdentityNotificationAttributesRequest(input),
        [_A]: _GINA,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetIdentityPoliciesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_GetIdentityPoliciesRequest(input),
        [_A]: _GIP,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetIdentityVerificationAttributesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_GetIdentityVerificationAttributesRequest(input),
        [_A]: _GIVA,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetSendQuotaCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    const body = buildFormUrlencodedString({
        [_A]: _GSQ,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetSendStatisticsCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    const body = buildFormUrlencodedString({
        [_A]: _GSS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_GetTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_GetTemplateRequest(input),
        [_A]: _GT,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ListConfigurationSetsCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_ListConfigurationSetsRequest(input),
        [_A]: _LCS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ListCustomVerificationEmailTemplatesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_ListCustomVerificationEmailTemplatesRequest(input),
        [_A]: _LCVET,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ListIdentitiesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_ListIdentitiesRequest(input),
        [_A]: _LI,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ListIdentityPoliciesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_ListIdentityPoliciesRequest(input),
        [_A]: _LIP,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ListReceiptFiltersCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_ListReceiptFiltersRequest(),
        [_A]: _LRF,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ListReceiptRuleSetsCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_ListReceiptRuleSetsRequest(input),
        [_A]: _LRRS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ListTemplatesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_ListTemplatesRequest(input),
        [_A]: _LT,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ListVerifiedEmailAddressesCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    const body = buildFormUrlencodedString({
        [_A]: _LVEA,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_PutConfigurationSetDeliveryOptionsCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_PutConfigurationSetDeliveryOptionsRequest(input),
        [_A]: _PCSDO,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_PutIdentityPolicyCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_PutIdentityPolicyRequest(input),
        [_A]: _PIP,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_ReorderReceiptRuleSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_ReorderReceiptRuleSetRequest(input),
        [_A]: _RRRS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SendBounceCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SendBounceRequest(input),
        [_A]: _SB,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SendBulkTemplatedEmailCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SendBulkTemplatedEmailRequest(input),
        [_A]: _SBTE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SendCustomVerificationEmailCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SendCustomVerificationEmailRequest(input),
        [_A]: _SCVE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SendEmailCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SendEmailRequest(input),
        [_A]: _SE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SendRawEmailCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SendRawEmailRequest(input, context),
        [_A]: _SRE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SendTemplatedEmailCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SendTemplatedEmailRequest(input),
        [_A]: _STE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SetActiveReceiptRuleSetCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SetActiveReceiptRuleSetRequest(input),
        [_A]: _SARRS,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SetIdentityDkimEnabledCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SetIdentityDkimEnabledRequest(input),
        [_A]: _SIDE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SetIdentityFeedbackForwardingEnabledCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SetIdentityFeedbackForwardingEnabledRequest(input),
        [_A]: _SIFFE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SetIdentityHeadersInNotificationsEnabledCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SetIdentityHeadersInNotificationsEnabledRequest(input),
        [_A]: _SIHINE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SetIdentityMailFromDomainCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SetIdentityMailFromDomainRequest(input),
        [_A]: _SIMFD,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SetIdentityNotificationTopicCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SetIdentityNotificationTopicRequest(input),
        [_A]: _SINT,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_SetReceiptRulePositionCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_SetReceiptRulePositionRequest(input),
        [_A]: _SRRP,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_TestRenderTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_TestRenderTemplateRequest(input),
        [_A]: _TRT,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_UpdateAccountSendingEnabledCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_UpdateAccountSendingEnabledRequest(input),
        [_A]: _UASE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_UpdateConfigurationSetEventDestinationCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_UpdateConfigurationSetEventDestinationRequest(input),
        [_A]: _UCSED,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_UpdateConfigurationSetReputationMetricsEnabledCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_UpdateConfigurationSetReputationMetricsEnabledRequest(input),
        [_A]: _UCSRME,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_UpdateConfigurationSetSendingEnabledCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_UpdateConfigurationSetSendingEnabledRequest(input),
        [_A]: _UCSSE,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_UpdateConfigurationSetTrackingOptionsCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_UpdateConfigurationSetTrackingOptionsRequest(input),
        [_A]: _UCSTO,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_UpdateCustomVerificationEmailTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_UpdateCustomVerificationEmailTemplateRequest(input),
        [_A]: _UCVET,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_UpdateReceiptRuleCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_UpdateReceiptRuleRequest(input),
        [_A]: _URR,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_UpdateTemplateCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_UpdateTemplateRequest(input),
        [_A]: _UT,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_VerifyDomainDkimCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_VerifyDomainDkimRequest(input),
        [_A]: _VDD,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_VerifyDomainIdentityCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_VerifyDomainIdentityRequest(input),
        [_A]: _VDI,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_VerifyEmailAddressCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_VerifyEmailAddressRequest(input),
        [_A]: _VEA,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_VerifyEmailIdentityCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_VerifyEmailIdentityRequest(input),
        [_A]: _VEI,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const de_CloneReceiptRuleSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_CloneReceiptRuleSetResponse(data.CloneReceiptRuleSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CreateConfigurationSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_CreateConfigurationSetResponse(data.CreateConfigurationSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CreateConfigurationSetEventDestinationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_CreateConfigurationSetEventDestinationResponse(data.CreateConfigurationSetEventDestinationResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CreateConfigurationSetTrackingOptionsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_CreateConfigurationSetTrackingOptionsResponse(data.CreateConfigurationSetTrackingOptionsResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CreateCustomVerificationEmailTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    await smithyClient.collectBody(output.body, context);
    const response = {
        $metadata: deserializeMetadata(output),
    };
    return response;
};
const de_CreateReceiptFilterCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_CreateReceiptFilterResponse(data.CreateReceiptFilterResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CreateReceiptRuleCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_CreateReceiptRuleResponse(data.CreateReceiptRuleResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CreateReceiptRuleSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_CreateReceiptRuleSetResponse(data.CreateReceiptRuleSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CreateTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_CreateTemplateResponse(data.CreateTemplateResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteConfigurationSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteConfigurationSetResponse(data.DeleteConfigurationSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteConfigurationSetEventDestinationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteConfigurationSetEventDestinationResponse(data.DeleteConfigurationSetEventDestinationResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteConfigurationSetTrackingOptionsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteConfigurationSetTrackingOptionsResponse(data.DeleteConfigurationSetTrackingOptionsResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteCustomVerificationEmailTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    await smithyClient.collectBody(output.body, context);
    const response = {
        $metadata: deserializeMetadata(output),
    };
    return response;
};
const de_DeleteIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteIdentityResponse(data.DeleteIdentityResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteIdentityPolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteIdentityPolicyResponse(data.DeleteIdentityPolicyResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteReceiptFilterCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteReceiptFilterResponse(data.DeleteReceiptFilterResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteReceiptRuleCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteReceiptRuleResponse(data.DeleteReceiptRuleResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteReceiptRuleSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteReceiptRuleSetResponse(data.DeleteReceiptRuleSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DeleteTemplateResponse(data.DeleteTemplateResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DeleteVerifiedEmailAddressCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    await smithyClient.collectBody(output.body, context);
    const response = {
        $metadata: deserializeMetadata(output),
    };
    return response;
};
const de_DescribeActiveReceiptRuleSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DescribeActiveReceiptRuleSetResponse(data.DescribeActiveReceiptRuleSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DescribeConfigurationSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DescribeConfigurationSetResponse(data.DescribeConfigurationSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DescribeReceiptRuleCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DescribeReceiptRuleResponse(data.DescribeReceiptRuleResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_DescribeReceiptRuleSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_DescribeReceiptRuleSetResponse(data.DescribeReceiptRuleSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetAccountSendingEnabledCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetAccountSendingEnabledResponse(data.GetAccountSendingEnabledResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetCustomVerificationEmailTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetCustomVerificationEmailTemplateResponse(data.GetCustomVerificationEmailTemplateResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetIdentityDkimAttributesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetIdentityDkimAttributesResponse(data.GetIdentityDkimAttributesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetIdentityMailFromDomainAttributesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetIdentityMailFromDomainAttributesResponse(data.GetIdentityMailFromDomainAttributesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetIdentityNotificationAttributesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetIdentityNotificationAttributesResponse(data.GetIdentityNotificationAttributesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetIdentityPoliciesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetIdentityPoliciesResponse(data.GetIdentityPoliciesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetIdentityVerificationAttributesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetIdentityVerificationAttributesResponse(data.GetIdentityVerificationAttributesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetSendQuotaCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetSendQuotaResponse(data.GetSendQuotaResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetSendStatisticsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetSendStatisticsResponse(data.GetSendStatisticsResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_GetTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_GetTemplateResponse(data.GetTemplateResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ListConfigurationSetsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ListConfigurationSetsResponse(data.ListConfigurationSetsResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ListCustomVerificationEmailTemplatesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ListCustomVerificationEmailTemplatesResponse(data.ListCustomVerificationEmailTemplatesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ListIdentitiesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ListIdentitiesResponse(data.ListIdentitiesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ListIdentityPoliciesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ListIdentityPoliciesResponse(data.ListIdentityPoliciesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ListReceiptFiltersCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ListReceiptFiltersResponse(data.ListReceiptFiltersResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ListReceiptRuleSetsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ListReceiptRuleSetsResponse(data.ListReceiptRuleSetsResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ListTemplatesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ListTemplatesResponse(data.ListTemplatesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ListVerifiedEmailAddressesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ListVerifiedEmailAddressesResponse(data.ListVerifiedEmailAddressesResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_PutConfigurationSetDeliveryOptionsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_PutConfigurationSetDeliveryOptionsResponse(data.PutConfigurationSetDeliveryOptionsResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_PutIdentityPolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_PutIdentityPolicyResponse(data.PutIdentityPolicyResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_ReorderReceiptRuleSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_ReorderReceiptRuleSetResponse(data.ReorderReceiptRuleSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SendBounceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SendBounceResponse(data.SendBounceResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SendBulkTemplatedEmailCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SendBulkTemplatedEmailResponse(data.SendBulkTemplatedEmailResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SendCustomVerificationEmailCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SendCustomVerificationEmailResponse(data.SendCustomVerificationEmailResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SendEmailCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SendEmailResponse(data.SendEmailResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SendRawEmailCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SendRawEmailResponse(data.SendRawEmailResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SendTemplatedEmailCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SendTemplatedEmailResponse(data.SendTemplatedEmailResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SetActiveReceiptRuleSetCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SetActiveReceiptRuleSetResponse(data.SetActiveReceiptRuleSetResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SetIdentityDkimEnabledCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SetIdentityDkimEnabledResponse(data.SetIdentityDkimEnabledResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SetIdentityFeedbackForwardingEnabledCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SetIdentityFeedbackForwardingEnabledResponse(data.SetIdentityFeedbackForwardingEnabledResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SetIdentityHeadersInNotificationsEnabledCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SetIdentityHeadersInNotificationsEnabledResponse(data.SetIdentityHeadersInNotificationsEnabledResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SetIdentityMailFromDomainCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SetIdentityMailFromDomainResponse(data.SetIdentityMailFromDomainResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SetIdentityNotificationTopicCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SetIdentityNotificationTopicResponse(data.SetIdentityNotificationTopicResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_SetReceiptRulePositionCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_SetReceiptRulePositionResponse(data.SetReceiptRulePositionResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_TestRenderTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_TestRenderTemplateResponse(data.TestRenderTemplateResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_UpdateAccountSendingEnabledCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    await smithyClient.collectBody(output.body, context);
    const response = {
        $metadata: deserializeMetadata(output),
    };
    return response;
};
const de_UpdateConfigurationSetEventDestinationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_UpdateConfigurationSetEventDestinationResponse(data.UpdateConfigurationSetEventDestinationResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_UpdateConfigurationSetReputationMetricsEnabledCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    await smithyClient.collectBody(output.body, context);
    const response = {
        $metadata: deserializeMetadata(output),
    };
    return response;
};
const de_UpdateConfigurationSetSendingEnabledCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    await smithyClient.collectBody(output.body, context);
    const response = {
        $metadata: deserializeMetadata(output),
    };
    return response;
};
const de_UpdateConfigurationSetTrackingOptionsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_UpdateConfigurationSetTrackingOptionsResponse(data.UpdateConfigurationSetTrackingOptionsResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_UpdateCustomVerificationEmailTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    await smithyClient.collectBody(output.body, context);
    const response = {
        $metadata: deserializeMetadata(output),
    };
    return response;
};
const de_UpdateReceiptRuleCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_UpdateReceiptRuleResponse(data.UpdateReceiptRuleResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_UpdateTemplateCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_UpdateTemplateResponse(data.UpdateTemplateResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_VerifyDomainDkimCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_VerifyDomainDkimResponse(data.VerifyDomainDkimResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_VerifyDomainIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_VerifyDomainIdentityResponse(data.VerifyDomainIdentityResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_VerifyEmailAddressCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    await smithyClient.collectBody(output.body, context);
    const response = {
        $metadata: deserializeMetadata(output),
    };
    return response;
};
const de_VerifyEmailIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await core$1.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_VerifyEmailIdentityResponse(data.VerifyEmailIdentityResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await core$1.parseXmlErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "AlreadyExists":
        case "com.amazonaws.ses#AlreadyExistsException":
            throw await de_AlreadyExistsExceptionRes(parsedOutput);
        case "LimitExceeded":
        case "com.amazonaws.ses#LimitExceededException":
            throw await de_LimitExceededExceptionRes(parsedOutput);
        case "RuleSetDoesNotExist":
        case "com.amazonaws.ses#RuleSetDoesNotExistException":
            throw await de_RuleSetDoesNotExistExceptionRes(parsedOutput);
        case "ConfigurationSetAlreadyExists":
        case "com.amazonaws.ses#ConfigurationSetAlreadyExistsException":
            throw await de_ConfigurationSetAlreadyExistsExceptionRes(parsedOutput);
        case "InvalidConfigurationSet":
        case "com.amazonaws.ses#InvalidConfigurationSetException":
            throw await de_InvalidConfigurationSetExceptionRes(parsedOutput);
        case "ConfigurationSetDoesNotExist":
        case "com.amazonaws.ses#ConfigurationSetDoesNotExistException":
            throw await de_ConfigurationSetDoesNotExistExceptionRes(parsedOutput);
        case "EventDestinationAlreadyExists":
        case "com.amazonaws.ses#EventDestinationAlreadyExistsException":
            throw await de_EventDestinationAlreadyExistsExceptionRes(parsedOutput);
        case "InvalidCloudWatchDestination":
        case "com.amazonaws.ses#InvalidCloudWatchDestinationException":
            throw await de_InvalidCloudWatchDestinationExceptionRes(parsedOutput);
        case "InvalidFirehoseDestination":
        case "com.amazonaws.ses#InvalidFirehoseDestinationException":
            throw await de_InvalidFirehoseDestinationExceptionRes(parsedOutput);
        case "InvalidSNSDestination":
        case "com.amazonaws.ses#InvalidSNSDestinationException":
            throw await de_InvalidSNSDestinationExceptionRes(parsedOutput);
        case "InvalidTrackingOptions":
        case "com.amazonaws.ses#InvalidTrackingOptionsException":
            throw await de_InvalidTrackingOptionsExceptionRes(parsedOutput);
        case "TrackingOptionsAlreadyExistsException":
        case "com.amazonaws.ses#TrackingOptionsAlreadyExistsException":
            throw await de_TrackingOptionsAlreadyExistsExceptionRes(parsedOutput);
        case "CustomVerificationEmailInvalidContent":
        case "com.amazonaws.ses#CustomVerificationEmailInvalidContentException":
            throw await de_CustomVerificationEmailInvalidContentExceptionRes(parsedOutput);
        case "CustomVerificationEmailTemplateAlreadyExists":
        case "com.amazonaws.ses#CustomVerificationEmailTemplateAlreadyExistsException":
            throw await de_CustomVerificationEmailTemplateAlreadyExistsExceptionRes(parsedOutput);
        case "FromEmailAddressNotVerified":
        case "com.amazonaws.ses#FromEmailAddressNotVerifiedException":
            throw await de_FromEmailAddressNotVerifiedExceptionRes(parsedOutput);
        case "InvalidLambdaFunction":
        case "com.amazonaws.ses#InvalidLambdaFunctionException":
            throw await de_InvalidLambdaFunctionExceptionRes(parsedOutput);
        case "InvalidS3Configuration":
        case "com.amazonaws.ses#InvalidS3ConfigurationException":
            throw await de_InvalidS3ConfigurationExceptionRes(parsedOutput);
        case "InvalidSnsTopic":
        case "com.amazonaws.ses#InvalidSnsTopicException":
            throw await de_InvalidSnsTopicExceptionRes(parsedOutput);
        case "RuleDoesNotExist":
        case "com.amazonaws.ses#RuleDoesNotExistException":
            throw await de_RuleDoesNotExistExceptionRes(parsedOutput);
        case "InvalidTemplate":
        case "com.amazonaws.ses#InvalidTemplateException":
            throw await de_InvalidTemplateExceptionRes(parsedOutput);
        case "EventDestinationDoesNotExist":
        case "com.amazonaws.ses#EventDestinationDoesNotExistException":
            throw await de_EventDestinationDoesNotExistExceptionRes(parsedOutput);
        case "TrackingOptionsDoesNotExistException":
        case "com.amazonaws.ses#TrackingOptionsDoesNotExistException":
            throw await de_TrackingOptionsDoesNotExistExceptionRes(parsedOutput);
        case "CannotDelete":
        case "com.amazonaws.ses#CannotDeleteException":
            throw await de_CannotDeleteExceptionRes(parsedOutput);
        case "CustomVerificationEmailTemplateDoesNotExist":
        case "com.amazonaws.ses#CustomVerificationEmailTemplateDoesNotExistException":
            throw await de_CustomVerificationEmailTemplateDoesNotExistExceptionRes(parsedOutput);
        case "TemplateDoesNotExist":
        case "com.amazonaws.ses#TemplateDoesNotExistException":
            throw await de_TemplateDoesNotExistExceptionRes(parsedOutput);
        case "InvalidDeliveryOptions":
        case "com.amazonaws.ses#InvalidDeliveryOptionsException":
            throw await de_InvalidDeliveryOptionsExceptionRes(parsedOutput);
        case "InvalidPolicy":
        case "com.amazonaws.ses#InvalidPolicyException":
            throw await de_InvalidPolicyExceptionRes(parsedOutput);
        case "MessageRejected":
        case "com.amazonaws.ses#MessageRejected":
            throw await de_MessageRejectedRes(parsedOutput);
        case "AccountSendingPausedException":
        case "com.amazonaws.ses#AccountSendingPausedException":
            throw await de_AccountSendingPausedExceptionRes(parsedOutput);
        case "ConfigurationSetSendingPausedException":
        case "com.amazonaws.ses#ConfigurationSetSendingPausedException":
            throw await de_ConfigurationSetSendingPausedExceptionRes(parsedOutput);
        case "MailFromDomainNotVerifiedException":
        case "com.amazonaws.ses#MailFromDomainNotVerifiedException":
            throw await de_MailFromDomainNotVerifiedExceptionRes(parsedOutput);
        case "ProductionAccessNotGranted":
        case "com.amazonaws.ses#ProductionAccessNotGrantedException":
            throw await de_ProductionAccessNotGrantedExceptionRes(parsedOutput);
        case "InvalidRenderingParameter":
        case "com.amazonaws.ses#InvalidRenderingParameterException":
            throw await de_InvalidRenderingParameterExceptionRes(parsedOutput);
        case "MissingRenderingAttribute":
        case "com.amazonaws.ses#MissingRenderingAttributeException":
            throw await de_MissingRenderingAttributeExceptionRes(parsedOutput);
        default:
            const parsedBody = parsedOutput.body;
            return throwDefaultError({
                output,
                parsedBody: parsedBody.Error,
                errorCode,
            });
    }
};
const de_AccountSendingPausedExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_AccountSendingPausedException(body.Error);
    const exception = new AccountSendingPausedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_AlreadyExistsExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_AlreadyExistsException(body.Error);
    const exception = new AlreadyExistsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_CannotDeleteExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_CannotDeleteException(body.Error);
    const exception = new CannotDeleteException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_ConfigurationSetAlreadyExistsExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ConfigurationSetAlreadyExistsException(body.Error);
    const exception = new ConfigurationSetAlreadyExistsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_ConfigurationSetDoesNotExistExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ConfigurationSetDoesNotExistException(body.Error);
    const exception = new ConfigurationSetDoesNotExistException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_ConfigurationSetSendingPausedExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ConfigurationSetSendingPausedException(body.Error);
    const exception = new ConfigurationSetSendingPausedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_CustomVerificationEmailInvalidContentExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_CustomVerificationEmailInvalidContentException(body.Error);
    const exception = new CustomVerificationEmailInvalidContentException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_CustomVerificationEmailTemplateAlreadyExistsExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_CustomVerificationEmailTemplateAlreadyExistsException(body.Error);
    const exception = new CustomVerificationEmailTemplateAlreadyExistsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_CustomVerificationEmailTemplateDoesNotExistExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_CustomVerificationEmailTemplateDoesNotExistException(body.Error);
    const exception = new CustomVerificationEmailTemplateDoesNotExistException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_EventDestinationAlreadyExistsExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_EventDestinationAlreadyExistsException(body.Error);
    const exception = new EventDestinationAlreadyExistsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_EventDestinationDoesNotExistExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_EventDestinationDoesNotExistException(body.Error);
    const exception = new EventDestinationDoesNotExistException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_FromEmailAddressNotVerifiedExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_FromEmailAddressNotVerifiedException(body.Error);
    const exception = new FromEmailAddressNotVerifiedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidCloudWatchDestinationExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidCloudWatchDestinationException(body.Error);
    const exception = new InvalidCloudWatchDestinationException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidConfigurationSetExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidConfigurationSetException(body.Error);
    const exception = new InvalidConfigurationSetException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidDeliveryOptionsExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidDeliveryOptionsException(body.Error);
    const exception = new InvalidDeliveryOptionsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidFirehoseDestinationExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidFirehoseDestinationException(body.Error);
    const exception = new InvalidFirehoseDestinationException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidLambdaFunctionExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidLambdaFunctionException(body.Error);
    const exception = new InvalidLambdaFunctionException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidPolicyExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidPolicyException(body.Error);
    const exception = new InvalidPolicyException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidRenderingParameterExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidRenderingParameterException(body.Error);
    const exception = new InvalidRenderingParameterException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidS3ConfigurationExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidS3ConfigurationException(body.Error);
    const exception = new InvalidS3ConfigurationException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidSNSDestinationExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidSNSDestinationException(body.Error);
    const exception = new InvalidSNSDestinationException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidSnsTopicExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidSnsTopicException(body.Error);
    const exception = new InvalidSnsTopicException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidTemplateExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidTemplateException(body.Error);
    const exception = new InvalidTemplateException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_InvalidTrackingOptionsExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidTrackingOptionsException(body.Error);
    const exception = new InvalidTrackingOptionsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_LimitExceededExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_LimitExceededException(body.Error);
    const exception = new LimitExceededException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_MailFromDomainNotVerifiedExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_MailFromDomainNotVerifiedException(body.Error);
    const exception = new MailFromDomainNotVerifiedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_MessageRejectedRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_MessageRejected(body.Error);
    const exception = new MessageRejected({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_MissingRenderingAttributeExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_MissingRenderingAttributeException(body.Error);
    const exception = new MissingRenderingAttributeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_ProductionAccessNotGrantedExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ProductionAccessNotGrantedException(body.Error);
    const exception = new ProductionAccessNotGrantedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_RuleDoesNotExistExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_RuleDoesNotExistException(body.Error);
    const exception = new RuleDoesNotExistException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_RuleSetDoesNotExistExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_RuleSetDoesNotExistException(body.Error);
    const exception = new RuleSetDoesNotExistException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_TemplateDoesNotExistExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_TemplateDoesNotExistException(body.Error);
    const exception = new TemplateDoesNotExistException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_TrackingOptionsAlreadyExistsExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_TrackingOptionsAlreadyExistsException(body.Error);
    const exception = new TrackingOptionsAlreadyExistsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const de_TrackingOptionsDoesNotExistExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_TrackingOptionsDoesNotExistException(body.Error);
    const exception = new TrackingOptionsDoesNotExistException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return smithyClient.decorateServiceException(exception, body);
};
const se_AddHeaderAction = (input, context) => {
    const entries = {};
    if (input[_HN] != null) {
        entries[_HN] = input[_HN];
    }
    if (input[_HV] != null) {
        entries[_HV] = input[_HV];
    }
    return entries;
};
const se_AddressList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_Body = (input, context) => {
    const entries = {};
    if (input[_T] != null) {
        const memberEntries = se_Content(input[_T]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Text.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_H] != null) {
        const memberEntries = se_Content(input[_H]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Html.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_BounceAction = (input, context) => {
    const entries = {};
    if (input[_TA] != null) {
        entries[_TA] = input[_TA];
    }
    if (input[_SRC] != null) {
        entries[_SRC] = input[_SRC];
    }
    if (input[_SC] != null) {
        entries[_SC] = input[_SC];
    }
    if (input[_M] != null) {
        entries[_M] = input[_M];
    }
    if (input[_S] != null) {
        entries[_S] = input[_S];
    }
    return entries;
};
const se_BouncedRecipientInfo = (input, context) => {
    const entries = {};
    if (input[_R] != null) {
        entries[_R] = input[_R];
    }
    if (input[_RA] != null) {
        entries[_RA] = input[_RA];
    }
    if (input[_BT] != null) {
        entries[_BT] = input[_BT];
    }
    if (input[_RDF] != null) {
        const memberEntries = se_RecipientDsnFields(input[_RDF]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `RecipientDsnFields.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_BouncedRecipientInfoList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_BouncedRecipientInfo(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_BulkEmailDestination = (input, context) => {
    const entries = {};
    if (input[_D] != null) {
        const memberEntries = se_Destination(input[_D]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Destination.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_RT] != null) {
        const memberEntries = se_MessageTagList(input[_RT]);
        if (input[_RT]?.length === 0) {
            entries.ReplacementTags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ReplacementTags.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_RTD] != null) {
        entries[_RTD] = input[_RTD];
    }
    return entries;
};
const se_BulkEmailDestinationList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_BulkEmailDestination(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_CloneReceiptRuleSetRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_ORSN] != null) {
        entries[_ORSN] = input[_ORSN];
    }
    return entries;
};
const se_CloudWatchDestination = (input, context) => {
    const entries = {};
    if (input[_DC] != null) {
        const memberEntries = se_CloudWatchDimensionConfigurations(input[_DC]);
        if (input[_DC]?.length === 0) {
            entries.DimensionConfigurations = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `DimensionConfigurations.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_CloudWatchDimensionConfiguration = (input, context) => {
    const entries = {};
    if (input[_DN] != null) {
        entries[_DN] = input[_DN];
    }
    if (input[_DVS] != null) {
        entries[_DVS] = input[_DVS];
    }
    if (input[_DDV] != null) {
        entries[_DDV] = input[_DDV];
    }
    return entries;
};
const se_CloudWatchDimensionConfigurations = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_CloudWatchDimensionConfiguration(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_ConfigurationSet = (input, context) => {
    const entries = {};
    if (input[_N] != null) {
        entries[_N] = input[_N];
    }
    return entries;
};
const se_ConfigurationSetAttributeList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_ConnectAction = (input, context) => {
    const entries = {};
    if (input[_IARN] != null) {
        entries[_IARN] = input[_IARN];
    }
    if (input[_IAMRARN] != null) {
        entries[_IAMRARN] = input[_IAMRARN];
    }
    return entries;
};
const se_Content = (input, context) => {
    const entries = {};
    if (input[_Da] != null) {
        entries[_Da] = input[_Da];
    }
    if (input[_C] != null) {
        entries[_C] = input[_C];
    }
    return entries;
};
const se_CreateConfigurationSetEventDestinationRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_ED] != null) {
        const memberEntries = se_EventDestination(input[_ED]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `EventDestination.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_CreateConfigurationSetRequest = (input, context) => {
    const entries = {};
    if (input[_CS] != null) {
        const memberEntries = se_ConfigurationSet(input[_CS]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ConfigurationSet.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_CreateConfigurationSetTrackingOptionsRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_TO] != null) {
        const memberEntries = se_TrackingOptions(input[_TO]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `TrackingOptions.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_CreateCustomVerificationEmailTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    if (input[_FEA] != null) {
        entries[_FEA] = input[_FEA];
    }
    if (input[_TS] != null) {
        entries[_TS] = input[_TS];
    }
    if (input[_TC] != null) {
        entries[_TC] = input[_TC];
    }
    if (input[_SRURL] != null) {
        entries[_SRURL] = input[_SRURL];
    }
    if (input[_FRURL] != null) {
        entries[_FRURL] = input[_FRURL];
    }
    return entries;
};
const se_CreateReceiptFilterRequest = (input, context) => {
    const entries = {};
    if (input[_F] != null) {
        const memberEntries = se_ReceiptFilter(input[_F]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Filter.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_CreateReceiptRuleRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_Af] != null) {
        entries[_Af] = input[_Af];
    }
    if (input[_Ru] != null) {
        const memberEntries = se_ReceiptRule(input[_Ru]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Rule.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_CreateReceiptRuleSetRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    return entries;
};
const se_CreateTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_Te] != null) {
        const memberEntries = se_Template(input[_Te]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Template.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_DeleteConfigurationSetEventDestinationRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_EDN] != null) {
        entries[_EDN] = input[_EDN];
    }
    return entries;
};
const se_DeleteConfigurationSetRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    return entries;
};
const se_DeleteConfigurationSetTrackingOptionsRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    return entries;
};
const se_DeleteCustomVerificationEmailTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    return entries;
};
const se_DeleteIdentityPolicyRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    if (input[_PN] != null) {
        entries[_PN] = input[_PN];
    }
    return entries;
};
const se_DeleteIdentityRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    return entries;
};
const se_DeleteReceiptFilterRequest = (input, context) => {
    const entries = {};
    if (input[_FN] != null) {
        entries[_FN] = input[_FN];
    }
    return entries;
};
const se_DeleteReceiptRuleRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_RN] != null) {
        entries[_RN] = input[_RN];
    }
    return entries;
};
const se_DeleteReceiptRuleSetRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    return entries;
};
const se_DeleteTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    return entries;
};
const se_DeleteVerifiedEmailAddressRequest = (input, context) => {
    const entries = {};
    if (input[_EA] != null) {
        entries[_EA] = input[_EA];
    }
    return entries;
};
const se_DeliveryOptions = (input, context) => {
    const entries = {};
    if (input[_TP] != null) {
        entries[_TP] = input[_TP];
    }
    return entries;
};
const se_DescribeActiveReceiptRuleSetRequest = (input, context) => {
    const entries = {};
    return entries;
};
const se_DescribeConfigurationSetRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_CSAN] != null) {
        const memberEntries = se_ConfigurationSetAttributeList(input[_CSAN]);
        if (input[_CSAN]?.length === 0) {
            entries.ConfigurationSetAttributeNames = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ConfigurationSetAttributeNames.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_DescribeReceiptRuleRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_RN] != null) {
        entries[_RN] = input[_RN];
    }
    return entries;
};
const se_DescribeReceiptRuleSetRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    return entries;
};
const se_Destination = (input, context) => {
    const entries = {};
    if (input[_TAo] != null) {
        const memberEntries = se_AddressList(input[_TAo]);
        if (input[_TAo]?.length === 0) {
            entries.ToAddresses = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ToAddresses.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_CA] != null) {
        const memberEntries = se_AddressList(input[_CA]);
        if (input[_CA]?.length === 0) {
            entries.CcAddresses = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `CcAddresses.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_BA] != null) {
        const memberEntries = se_AddressList(input[_BA]);
        if (input[_BA]?.length === 0) {
            entries.BccAddresses = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `BccAddresses.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_EventDestination = (input, context) => {
    const entries = {};
    if (input[_N] != null) {
        entries[_N] = input[_N];
    }
    if (input[_E] != null) {
        entries[_E] = input[_E];
    }
    if (input[_MET] != null) {
        const memberEntries = se_EventTypes(input[_MET]);
        if (input[_MET]?.length === 0) {
            entries.MatchingEventTypes = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `MatchingEventTypes.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_KFD] != null) {
        const memberEntries = se_KinesisFirehoseDestination(input[_KFD]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `KinesisFirehoseDestination.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_CWD] != null) {
        const memberEntries = se_CloudWatchDestination(input[_CWD]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `CloudWatchDestination.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_SNSD] != null) {
        const memberEntries = se_SNSDestination(input[_SNSD]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `SNSDestination.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_EventTypes = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_ExtensionField = (input, context) => {
    const entries = {};
    if (input[_N] != null) {
        entries[_N] = input[_N];
    }
    if (input[_Va] != null) {
        entries[_Va] = input[_Va];
    }
    return entries;
};
const se_ExtensionFieldList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_ExtensionField(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_GetCustomVerificationEmailTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    return entries;
};
const se_GetIdentityDkimAttributesRequest = (input, context) => {
    const entries = {};
    if (input[_Id] != null) {
        const memberEntries = se_IdentityList(input[_Id]);
        if (input[_Id]?.length === 0) {
            entries.Identities = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Identities.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_GetIdentityMailFromDomainAttributesRequest = (input, context) => {
    const entries = {};
    if (input[_Id] != null) {
        const memberEntries = se_IdentityList(input[_Id]);
        if (input[_Id]?.length === 0) {
            entries.Identities = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Identities.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_GetIdentityNotificationAttributesRequest = (input, context) => {
    const entries = {};
    if (input[_Id] != null) {
        const memberEntries = se_IdentityList(input[_Id]);
        if (input[_Id]?.length === 0) {
            entries.Identities = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Identities.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_GetIdentityPoliciesRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    if (input[_PNo] != null) {
        const memberEntries = se_PolicyNameList(input[_PNo]);
        if (input[_PNo]?.length === 0) {
            entries.PolicyNames = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyNames.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_GetIdentityVerificationAttributesRequest = (input, context) => {
    const entries = {};
    if (input[_Id] != null) {
        const memberEntries = se_IdentityList(input[_Id]);
        if (input[_Id]?.length === 0) {
            entries.Identities = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Identities.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_GetTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    return entries;
};
const se_IdentityList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_KinesisFirehoseDestination = (input, context) => {
    const entries = {};
    if (input[_IAMRARN] != null) {
        entries[_IAMRARN] = input[_IAMRARN];
    }
    if (input[_DSARN] != null) {
        entries[_DSARN] = input[_DSARN];
    }
    return entries;
};
const se_LambdaAction = (input, context) => {
    const entries = {};
    if (input[_TA] != null) {
        entries[_TA] = input[_TA];
    }
    if (input[_FA] != null) {
        entries[_FA] = input[_FA];
    }
    if (input[_IT] != null) {
        entries[_IT] = input[_IT];
    }
    return entries;
};
const se_ListConfigurationSetsRequest = (input, context) => {
    const entries = {};
    if (input[_NT] != null) {
        entries[_NT] = input[_NT];
    }
    if (input[_MI] != null) {
        entries[_MI] = input[_MI];
    }
    return entries;
};
const se_ListCustomVerificationEmailTemplatesRequest = (input, context) => {
    const entries = {};
    if (input[_NT] != null) {
        entries[_NT] = input[_NT];
    }
    if (input[_MR] != null) {
        entries[_MR] = input[_MR];
    }
    return entries;
};
const se_ListIdentitiesRequest = (input, context) => {
    const entries = {};
    if (input[_ITd] != null) {
        entries[_ITd] = input[_ITd];
    }
    if (input[_NT] != null) {
        entries[_NT] = input[_NT];
    }
    if (input[_MI] != null) {
        entries[_MI] = input[_MI];
    }
    return entries;
};
const se_ListIdentityPoliciesRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    return entries;
};
const se_ListReceiptFiltersRequest = (input, context) => {
    const entries = {};
    return entries;
};
const se_ListReceiptRuleSetsRequest = (input, context) => {
    const entries = {};
    if (input[_NT] != null) {
        entries[_NT] = input[_NT];
    }
    return entries;
};
const se_ListTemplatesRequest = (input, context) => {
    const entries = {};
    if (input[_NT] != null) {
        entries[_NT] = input[_NT];
    }
    if (input[_MI] != null) {
        entries[_MI] = input[_MI];
    }
    return entries;
};
const se_Message = (input, context) => {
    const entries = {};
    if (input[_Su] != null) {
        const memberEntries = se_Content(input[_Su]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Subject.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_B] != null) {
        const memberEntries = se_Body(input[_B]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Body.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_MessageDsn = (input, context) => {
    const entries = {};
    if (input[_RM] != null) {
        entries[_RM] = input[_RM];
    }
    if (input[_AD] != null) {
        entries[_AD] = smithyClient.serializeDateTime(input[_AD]);
    }
    if (input[_EF] != null) {
        const memberEntries = se_ExtensionFieldList(input[_EF]);
        if (input[_EF]?.length === 0) {
            entries.ExtensionFields = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ExtensionFields.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_MessageTag = (input, context) => {
    const entries = {};
    if (input[_N] != null) {
        entries[_N] = input[_N];
    }
    if (input[_Va] != null) {
        entries[_Va] = input[_Va];
    }
    return entries;
};
const se_MessageTagList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_MessageTag(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_PolicyNameList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_PutConfigurationSetDeliveryOptionsRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_DO] != null) {
        const memberEntries = se_DeliveryOptions(input[_DO]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `DeliveryOptions.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_PutIdentityPolicyRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    if (input[_PN] != null) {
        entries[_PN] = input[_PN];
    }
    if (input[_P] != null) {
        entries[_P] = input[_P];
    }
    return entries;
};
const se_RawMessage = (input, context) => {
    const entries = {};
    if (input[_Da] != null) {
        entries[_Da] = context.base64Encoder(input[_Da]);
    }
    return entries;
};
const se_ReceiptAction = (input, context) => {
    const entries = {};
    if (input[_SA] != null) {
        const memberEntries = se_S3Action(input[_SA]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `S3Action.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_BAo] != null) {
        const memberEntries = se_BounceAction(input[_BAo]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `BounceAction.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_WA] != null) {
        const memberEntries = se_WorkmailAction(input[_WA]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `WorkmailAction.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_LA] != null) {
        const memberEntries = se_LambdaAction(input[_LA]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `LambdaAction.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_SAt] != null) {
        const memberEntries = se_StopAction(input[_SAt]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `StopAction.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_AHA] != null) {
        const memberEntries = se_AddHeaderAction(input[_AHA]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `AddHeaderAction.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_SNSA] != null) {
        const memberEntries = se_SNSAction(input[_SNSA]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `SNSAction.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_CAo] != null) {
        const memberEntries = se_ConnectAction(input[_CAo]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ConnectAction.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_ReceiptActionsList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_ReceiptAction(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_ReceiptFilter = (input, context) => {
    const entries = {};
    if (input[_N] != null) {
        entries[_N] = input[_N];
    }
    if (input[_IF] != null) {
        const memberEntries = se_ReceiptIpFilter(input[_IF]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `IpFilter.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_ReceiptIpFilter = (input, context) => {
    const entries = {};
    if (input[_P] != null) {
        entries[_P] = input[_P];
    }
    if (input[_Ci] != null) {
        entries[_Ci] = input[_Ci];
    }
    return entries;
};
const se_ReceiptRule = (input, context) => {
    const entries = {};
    if (input[_N] != null) {
        entries[_N] = input[_N];
    }
    if (input[_E] != null) {
        entries[_E] = input[_E];
    }
    if (input[_TP] != null) {
        entries[_TP] = input[_TP];
    }
    if (input[_Re] != null) {
        const memberEntries = se_RecipientsList(input[_Re]);
        if (input[_Re]?.length === 0) {
            entries.Recipients = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Recipients.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_Ac] != null) {
        const memberEntries = se_ReceiptActionsList(input[_Ac]);
        if (input[_Ac]?.length === 0) {
            entries.Actions = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Actions.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_SEc] != null) {
        entries[_SEc] = input[_SEc];
    }
    return entries;
};
const se_ReceiptRuleNamesList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_RecipientDsnFields = (input, context) => {
    const entries = {};
    if (input[_FR] != null) {
        entries[_FR] = input[_FR];
    }
    if (input[_A] != null) {
        entries[_A] = input[_A];
    }
    if (input[_RMe] != null) {
        entries[_RMe] = input[_RMe];
    }
    if (input[_St] != null) {
        entries[_St] = input[_St];
    }
    if (input[_DCi] != null) {
        entries[_DCi] = input[_DCi];
    }
    if (input[_LAD] != null) {
        entries[_LAD] = smithyClient.serializeDateTime(input[_LAD]);
    }
    if (input[_EF] != null) {
        const memberEntries = se_ExtensionFieldList(input[_EF]);
        if (input[_EF]?.length === 0) {
            entries.ExtensionFields = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ExtensionFields.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_RecipientsList = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_ReorderReceiptRuleSetRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_RNu] != null) {
        const memberEntries = se_ReceiptRuleNamesList(input[_RNu]);
        if (input[_RNu]?.length === 0) {
            entries.RuleNames = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `RuleNames.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_S3Action = (input, context) => {
    const entries = {};
    if (input[_TA] != null) {
        entries[_TA] = input[_TA];
    }
    if (input[_BN] != null) {
        entries[_BN] = input[_BN];
    }
    if (input[_OKP] != null) {
        entries[_OKP] = input[_OKP];
    }
    if (input[_KKA] != null) {
        entries[_KKA] = input[_KKA];
    }
    if (input[_IRA] != null) {
        entries[_IRA] = input[_IRA];
    }
    return entries;
};
const se_SendBounceRequest = (input, context) => {
    const entries = {};
    if (input[_OMI] != null) {
        entries[_OMI] = input[_OMI];
    }
    if (input[_BS] != null) {
        entries[_BS] = input[_BS];
    }
    if (input[_Ex] != null) {
        entries[_Ex] = input[_Ex];
    }
    if (input[_MD] != null) {
        const memberEntries = se_MessageDsn(input[_MD]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `MessageDsn.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_BRIL] != null) {
        const memberEntries = se_BouncedRecipientInfoList(input[_BRIL]);
        if (input[_BRIL]?.length === 0) {
            entries.BouncedRecipientInfoList = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `BouncedRecipientInfoList.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_BSA] != null) {
        entries[_BSA] = input[_BSA];
    }
    return entries;
};
const se_SendBulkTemplatedEmailRequest = (input, context) => {
    const entries = {};
    if (input[_So] != null) {
        entries[_So] = input[_So];
    }
    if (input[_SAo] != null) {
        entries[_SAo] = input[_SAo];
    }
    if (input[_RTA] != null) {
        const memberEntries = se_AddressList(input[_RTA]);
        if (input[_RTA]?.length === 0) {
            entries.ReplyToAddresses = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ReplyToAddresses.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_RP] != null) {
        entries[_RP] = input[_RP];
    }
    if (input[_RPA] != null) {
        entries[_RPA] = input[_RPA];
    }
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_DTe] != null) {
        const memberEntries = se_MessageTagList(input[_DTe]);
        if (input[_DTe]?.length === 0) {
            entries.DefaultTags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `DefaultTags.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_Te] != null) {
        entries[_Te] = input[_Te];
    }
    if (input[_TAe] != null) {
        entries[_TAe] = input[_TAe];
    }
    if (input[_DTD] != null) {
        entries[_DTD] = input[_DTD];
    }
    if (input[_De] != null) {
        const memberEntries = se_BulkEmailDestinationList(input[_De]);
        if (input[_De]?.length === 0) {
            entries.Destinations = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Destinations.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_SendCustomVerificationEmailRequest = (input, context) => {
    const entries = {};
    if (input[_EA] != null) {
        entries[_EA] = input[_EA];
    }
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    return entries;
};
const se_SendEmailRequest = (input, context) => {
    const entries = {};
    if (input[_So] != null) {
        entries[_So] = input[_So];
    }
    if (input[_D] != null) {
        const memberEntries = se_Destination(input[_D]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Destination.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_M] != null) {
        const memberEntries = se_Message(input[_M]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Message.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_RTA] != null) {
        const memberEntries = se_AddressList(input[_RTA]);
        if (input[_RTA]?.length === 0) {
            entries.ReplyToAddresses = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ReplyToAddresses.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_RP] != null) {
        entries[_RP] = input[_RP];
    }
    if (input[_SAo] != null) {
        entries[_SAo] = input[_SAo];
    }
    if (input[_RPA] != null) {
        entries[_RPA] = input[_RPA];
    }
    if (input[_Ta] != null) {
        const memberEntries = se_MessageTagList(input[_Ta]);
        if (input[_Ta]?.length === 0) {
            entries.Tags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    return entries;
};
const se_SendRawEmailRequest = (input, context) => {
    const entries = {};
    if (input[_So] != null) {
        entries[_So] = input[_So];
    }
    if (input[_De] != null) {
        const memberEntries = se_AddressList(input[_De]);
        if (input[_De]?.length === 0) {
            entries.Destinations = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Destinations.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_RMa] != null) {
        const memberEntries = se_RawMessage(input[_RMa], context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `RawMessage.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_FAr] != null) {
        entries[_FAr] = input[_FAr];
    }
    if (input[_SAo] != null) {
        entries[_SAo] = input[_SAo];
    }
    if (input[_RPA] != null) {
        entries[_RPA] = input[_RPA];
    }
    if (input[_Ta] != null) {
        const memberEntries = se_MessageTagList(input[_Ta]);
        if (input[_Ta]?.length === 0) {
            entries.Tags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    return entries;
};
const se_SendTemplatedEmailRequest = (input, context) => {
    const entries = {};
    if (input[_So] != null) {
        entries[_So] = input[_So];
    }
    if (input[_D] != null) {
        const memberEntries = se_Destination(input[_D]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Destination.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_RTA] != null) {
        const memberEntries = se_AddressList(input[_RTA]);
        if (input[_RTA]?.length === 0) {
            entries.ReplyToAddresses = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ReplyToAddresses.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_RP] != null) {
        entries[_RP] = input[_RP];
    }
    if (input[_SAo] != null) {
        entries[_SAo] = input[_SAo];
    }
    if (input[_RPA] != null) {
        entries[_RPA] = input[_RPA];
    }
    if (input[_Ta] != null) {
        const memberEntries = se_MessageTagList(input[_Ta]);
        if (input[_Ta]?.length === 0) {
            entries.Tags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_Te] != null) {
        entries[_Te] = input[_Te];
    }
    if (input[_TAe] != null) {
        entries[_TAe] = input[_TAe];
    }
    if (input[_TD] != null) {
        entries[_TD] = input[_TD];
    }
    return entries;
};
const se_SetActiveReceiptRuleSetRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    return entries;
};
const se_SetIdentityDkimEnabledRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    if (input[_DE] != null) {
        entries[_DE] = input[_DE];
    }
    return entries;
};
const se_SetIdentityFeedbackForwardingEnabledRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    if (input[_FE] != null) {
        entries[_FE] = input[_FE];
    }
    return entries;
};
const se_SetIdentityHeadersInNotificationsEnabledRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    if (input[_NTo] != null) {
        entries[_NTo] = input[_NTo];
    }
    if (input[_E] != null) {
        entries[_E] = input[_E];
    }
    return entries;
};
const se_SetIdentityMailFromDomainRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    if (input[_MFD] != null) {
        entries[_MFD] = input[_MFD];
    }
    if (input[_BOMXF] != null) {
        entries[_BOMXF] = input[_BOMXF];
    }
    return entries;
};
const se_SetIdentityNotificationTopicRequest = (input, context) => {
    const entries = {};
    if (input[_I] != null) {
        entries[_I] = input[_I];
    }
    if (input[_NTo] != null) {
        entries[_NTo] = input[_NTo];
    }
    if (input[_ST] != null) {
        entries[_ST] = input[_ST];
    }
    return entries;
};
const se_SetReceiptRulePositionRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_RN] != null) {
        entries[_RN] = input[_RN];
    }
    if (input[_Af] != null) {
        entries[_Af] = input[_Af];
    }
    return entries;
};
const se_SNSAction = (input, context) => {
    const entries = {};
    if (input[_TA] != null) {
        entries[_TA] = input[_TA];
    }
    if (input[_En] != null) {
        entries[_En] = input[_En];
    }
    return entries;
};
const se_SNSDestination = (input, context) => {
    const entries = {};
    if (input[_TARN] != null) {
        entries[_TARN] = input[_TARN];
    }
    return entries;
};
const se_StopAction = (input, context) => {
    const entries = {};
    if (input[_Sc] != null) {
        entries[_Sc] = input[_Sc];
    }
    if (input[_TA] != null) {
        entries[_TA] = input[_TA];
    }
    return entries;
};
const se_Template = (input, context) => {
    const entries = {};
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    if (input[_SP] != null) {
        entries[_SP] = input[_SP];
    }
    if (input[_TPe] != null) {
        entries[_TPe] = input[_TPe];
    }
    if (input[_HP] != null) {
        entries[_HP] = input[_HP];
    }
    return entries;
};
const se_TestRenderTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    if (input[_TD] != null) {
        entries[_TD] = input[_TD];
    }
    return entries;
};
const se_TrackingOptions = (input, context) => {
    const entries = {};
    if (input[_CRD] != null) {
        entries[_CRD] = input[_CRD];
    }
    return entries;
};
const se_UpdateAccountSendingEnabledRequest = (input, context) => {
    const entries = {};
    if (input[_E] != null) {
        entries[_E] = input[_E];
    }
    return entries;
};
const se_UpdateConfigurationSetEventDestinationRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_ED] != null) {
        const memberEntries = se_EventDestination(input[_ED]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `EventDestination.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_UpdateConfigurationSetReputationMetricsEnabledRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_E] != null) {
        entries[_E] = input[_E];
    }
    return entries;
};
const se_UpdateConfigurationSetSendingEnabledRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_E] != null) {
        entries[_E] = input[_E];
    }
    return entries;
};
const se_UpdateConfigurationSetTrackingOptionsRequest = (input, context) => {
    const entries = {};
    if (input[_CSN] != null) {
        entries[_CSN] = input[_CSN];
    }
    if (input[_TO] != null) {
        const memberEntries = se_TrackingOptions(input[_TO]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `TrackingOptions.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_UpdateCustomVerificationEmailTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_TN] != null) {
        entries[_TN] = input[_TN];
    }
    if (input[_FEA] != null) {
        entries[_FEA] = input[_FEA];
    }
    if (input[_TS] != null) {
        entries[_TS] = input[_TS];
    }
    if (input[_TC] != null) {
        entries[_TC] = input[_TC];
    }
    if (input[_SRURL] != null) {
        entries[_SRURL] = input[_SRURL];
    }
    if (input[_FRURL] != null) {
        entries[_FRURL] = input[_FRURL];
    }
    return entries;
};
const se_UpdateReceiptRuleRequest = (input, context) => {
    const entries = {};
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_Ru] != null) {
        const memberEntries = se_ReceiptRule(input[_Ru]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Rule.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_UpdateTemplateRequest = (input, context) => {
    const entries = {};
    if (input[_Te] != null) {
        const memberEntries = se_Template(input[_Te]);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Template.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_VerifyDomainDkimRequest = (input, context) => {
    const entries = {};
    if (input[_Do] != null) {
        entries[_Do] = input[_Do];
    }
    return entries;
};
const se_VerifyDomainIdentityRequest = (input, context) => {
    const entries = {};
    if (input[_Do] != null) {
        entries[_Do] = input[_Do];
    }
    return entries;
};
const se_VerifyEmailAddressRequest = (input, context) => {
    const entries = {};
    if (input[_EA] != null) {
        entries[_EA] = input[_EA];
    }
    return entries;
};
const se_VerifyEmailIdentityRequest = (input, context) => {
    const entries = {};
    if (input[_EA] != null) {
        entries[_EA] = input[_EA];
    }
    return entries;
};
const se_WorkmailAction = (input, context) => {
    const entries = {};
    if (input[_TA] != null) {
        entries[_TA] = input[_TA];
    }
    if (input[_OA] != null) {
        entries[_OA] = input[_OA];
    }
    return entries;
};
const de_AccountSendingPausedException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_AddHeaderAction = (output, context) => {
    const contents = {};
    if (output[_HN] != null) {
        contents[_HN] = smithyClient.expectString(output[_HN]);
    }
    if (output[_HV] != null) {
        contents[_HV] = smithyClient.expectString(output[_HV]);
    }
    return contents;
};
const de_AddressList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return smithyClient.expectString(entry);
    });
};
const de_AlreadyExistsException = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_BounceAction = (output, context) => {
    const contents = {};
    if (output[_TA] != null) {
        contents[_TA] = smithyClient.expectString(output[_TA]);
    }
    if (output[_SRC] != null) {
        contents[_SRC] = smithyClient.expectString(output[_SRC]);
    }
    if (output[_SC] != null) {
        contents[_SC] = smithyClient.expectString(output[_SC]);
    }
    if (output[_M] != null) {
        contents[_M] = smithyClient.expectString(output[_M]);
    }
    if (output[_S] != null) {
        contents[_S] = smithyClient.expectString(output[_S]);
    }
    return contents;
};
const de_BulkEmailDestinationStatus = (output, context) => {
    const contents = {};
    if (output[_St] != null) {
        contents[_St] = smithyClient.expectString(output[_St]);
    }
    if (output[_Er] != null) {
        contents[_Er] = smithyClient.expectString(output[_Er]);
    }
    if (output[_MIe] != null) {
        contents[_MIe] = smithyClient.expectString(output[_MIe]);
    }
    return contents;
};
const de_BulkEmailDestinationStatusList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_BulkEmailDestinationStatus(entry);
    });
};
const de_CannotDeleteException = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_CloneReceiptRuleSetResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_CloudWatchDestination = (output, context) => {
    const contents = {};
    if (String(output.DimensionConfigurations).trim() === "") {
        contents[_DC] = [];
    }
    else if (output[_DC] != null && output[_DC][_me] != null) {
        contents[_DC] = de_CloudWatchDimensionConfigurations(smithyClient.getArrayIfSingleItem(output[_DC][_me]));
    }
    return contents;
};
const de_CloudWatchDimensionConfiguration = (output, context) => {
    const contents = {};
    if (output[_DN] != null) {
        contents[_DN] = smithyClient.expectString(output[_DN]);
    }
    if (output[_DVS] != null) {
        contents[_DVS] = smithyClient.expectString(output[_DVS]);
    }
    if (output[_DDV] != null) {
        contents[_DDV] = smithyClient.expectString(output[_DDV]);
    }
    return contents;
};
const de_CloudWatchDimensionConfigurations = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_CloudWatchDimensionConfiguration(entry);
    });
};
const de_ConfigurationSet = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    return contents;
};
const de_ConfigurationSetAlreadyExistsException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_ConfigurationSetDoesNotExistException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_ConfigurationSets = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_ConfigurationSet(entry);
    });
};
const de_ConfigurationSetSendingPausedException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_ConnectAction = (output, context) => {
    const contents = {};
    if (output[_IARN] != null) {
        contents[_IARN] = smithyClient.expectString(output[_IARN]);
    }
    if (output[_IAMRARN] != null) {
        contents[_IAMRARN] = smithyClient.expectString(output[_IAMRARN]);
    }
    return contents;
};
const de_CreateConfigurationSetEventDestinationResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_CreateConfigurationSetResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_CreateConfigurationSetTrackingOptionsResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_CreateReceiptFilterResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_CreateReceiptRuleResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_CreateReceiptRuleSetResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_CreateTemplateResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_CustomVerificationEmailInvalidContentException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_CustomVerificationEmailTemplate = (output, context) => {
    const contents = {};
    if (output[_TN] != null) {
        contents[_TN] = smithyClient.expectString(output[_TN]);
    }
    if (output[_FEA] != null) {
        contents[_FEA] = smithyClient.expectString(output[_FEA]);
    }
    if (output[_TS] != null) {
        contents[_TS] = smithyClient.expectString(output[_TS]);
    }
    if (output[_SRURL] != null) {
        contents[_SRURL] = smithyClient.expectString(output[_SRURL]);
    }
    if (output[_FRURL] != null) {
        contents[_FRURL] = smithyClient.expectString(output[_FRURL]);
    }
    return contents;
};
const de_CustomVerificationEmailTemplateAlreadyExistsException = (output, context) => {
    const contents = {};
    if (output[_CVETN] != null) {
        contents[_CVETN] = smithyClient.expectString(output[_CVETN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_CustomVerificationEmailTemplateDoesNotExistException = (output, context) => {
    const contents = {};
    if (output[_CVETN] != null) {
        contents[_CVETN] = smithyClient.expectString(output[_CVETN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_CustomVerificationEmailTemplates = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_CustomVerificationEmailTemplate(entry);
    });
};
const de_DeleteConfigurationSetEventDestinationResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeleteConfigurationSetResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeleteConfigurationSetTrackingOptionsResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeleteIdentityPolicyResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeleteIdentityResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeleteReceiptFilterResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeleteReceiptRuleResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeleteReceiptRuleSetResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeleteTemplateResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_DeliveryOptions = (output, context) => {
    const contents = {};
    if (output[_TP] != null) {
        contents[_TP] = smithyClient.expectString(output[_TP]);
    }
    return contents;
};
const de_DescribeActiveReceiptRuleSetResponse = (output, context) => {
    const contents = {};
    if (output[_Me] != null) {
        contents[_Me] = de_ReceiptRuleSetMetadata(output[_Me]);
    }
    if (String(output.Rules).trim() === "") {
        contents[_Rul] = [];
    }
    else if (output[_Rul] != null && output[_Rul][_me] != null) {
        contents[_Rul] = de_ReceiptRulesList(smithyClient.getArrayIfSingleItem(output[_Rul][_me]));
    }
    return contents;
};
const de_DescribeConfigurationSetResponse = (output, context) => {
    const contents = {};
    if (output[_CS] != null) {
        contents[_CS] = de_ConfigurationSet(output[_CS]);
    }
    if (String(output.EventDestinations).trim() === "") {
        contents[_EDv] = [];
    }
    else if (output[_EDv] != null && output[_EDv][_me] != null) {
        contents[_EDv] = de_EventDestinations(smithyClient.getArrayIfSingleItem(output[_EDv][_me]));
    }
    if (output[_TO] != null) {
        contents[_TO] = de_TrackingOptions(output[_TO]);
    }
    if (output[_DO] != null) {
        contents[_DO] = de_DeliveryOptions(output[_DO]);
    }
    if (output[_RO] != null) {
        contents[_RO] = de_ReputationOptions(output[_RO]);
    }
    return contents;
};
const de_DescribeReceiptRuleResponse = (output, context) => {
    const contents = {};
    if (output[_Ru] != null) {
        contents[_Ru] = de_ReceiptRule(output[_Ru]);
    }
    return contents;
};
const de_DescribeReceiptRuleSetResponse = (output, context) => {
    const contents = {};
    if (output[_Me] != null) {
        contents[_Me] = de_ReceiptRuleSetMetadata(output[_Me]);
    }
    if (String(output.Rules).trim() === "") {
        contents[_Rul] = [];
    }
    else if (output[_Rul] != null && output[_Rul][_me] != null) {
        contents[_Rul] = de_ReceiptRulesList(smithyClient.getArrayIfSingleItem(output[_Rul][_me]));
    }
    return contents;
};
const de_DkimAttributes = (output, context) => {
    return output.reduce((acc, pair) => {
        if (pair["value"] === null) {
            return acc;
        }
        acc[pair["key"]] = de_IdentityDkimAttributes(pair["value"]);
        return acc;
    }, {});
};
const de_EventDestination = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_E] != null) {
        contents[_E] = smithyClient.parseBoolean(output[_E]);
    }
    if (String(output.MatchingEventTypes).trim() === "") {
        contents[_MET] = [];
    }
    else if (output[_MET] != null && output[_MET][_me] != null) {
        contents[_MET] = de_EventTypes(smithyClient.getArrayIfSingleItem(output[_MET][_me]));
    }
    if (output[_KFD] != null) {
        contents[_KFD] = de_KinesisFirehoseDestination(output[_KFD]);
    }
    if (output[_CWD] != null) {
        contents[_CWD] = de_CloudWatchDestination(output[_CWD]);
    }
    if (output[_SNSD] != null) {
        contents[_SNSD] = de_SNSDestination(output[_SNSD]);
    }
    return contents;
};
const de_EventDestinationAlreadyExistsException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_EDN] != null) {
        contents[_EDN] = smithyClient.expectString(output[_EDN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_EventDestinationDoesNotExistException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_EDN] != null) {
        contents[_EDN] = smithyClient.expectString(output[_EDN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_EventDestinations = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_EventDestination(entry);
    });
};
const de_EventTypes = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return smithyClient.expectString(entry);
    });
};
const de_FromEmailAddressNotVerifiedException = (output, context) => {
    const contents = {};
    if (output[_FEA] != null) {
        contents[_FEA] = smithyClient.expectString(output[_FEA]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_GetAccountSendingEnabledResponse = (output, context) => {
    const contents = {};
    if (output[_E] != null) {
        contents[_E] = smithyClient.parseBoolean(output[_E]);
    }
    return contents;
};
const de_GetCustomVerificationEmailTemplateResponse = (output, context) => {
    const contents = {};
    if (output[_TN] != null) {
        contents[_TN] = smithyClient.expectString(output[_TN]);
    }
    if (output[_FEA] != null) {
        contents[_FEA] = smithyClient.expectString(output[_FEA]);
    }
    if (output[_TS] != null) {
        contents[_TS] = smithyClient.expectString(output[_TS]);
    }
    if (output[_TC] != null) {
        contents[_TC] = smithyClient.expectString(output[_TC]);
    }
    if (output[_SRURL] != null) {
        contents[_SRURL] = smithyClient.expectString(output[_SRURL]);
    }
    if (output[_FRURL] != null) {
        contents[_FRURL] = smithyClient.expectString(output[_FRURL]);
    }
    return contents;
};
const de_GetIdentityDkimAttributesResponse = (output, context) => {
    const contents = {};
    if (String(output.DkimAttributes).trim() === "") {
        contents[_DA] = {};
    }
    else if (output[_DA] != null && output[_DA][_e] != null) {
        contents[_DA] = de_DkimAttributes(smithyClient.getArrayIfSingleItem(output[_DA][_e]));
    }
    return contents;
};
const de_GetIdentityMailFromDomainAttributesResponse = (output, context) => {
    const contents = {};
    if (String(output.MailFromDomainAttributes).trim() === "") {
        contents[_MFDA] = {};
    }
    else if (output[_MFDA] != null && output[_MFDA][_e] != null) {
        contents[_MFDA] = de_MailFromDomainAttributes(smithyClient.getArrayIfSingleItem(output[_MFDA][_e]));
    }
    return contents;
};
const de_GetIdentityNotificationAttributesResponse = (output, context) => {
    const contents = {};
    if (String(output.NotificationAttributes).trim() === "") {
        contents[_NA] = {};
    }
    else if (output[_NA] != null && output[_NA][_e] != null) {
        contents[_NA] = de_NotificationAttributes(smithyClient.getArrayIfSingleItem(output[_NA][_e]));
    }
    return contents;
};
const de_GetIdentityPoliciesResponse = (output, context) => {
    const contents = {};
    if (String(output.Policies).trim() === "") {
        contents[_Po] = {};
    }
    else if (output[_Po] != null && output[_Po][_e] != null) {
        contents[_Po] = de_PolicyMap(smithyClient.getArrayIfSingleItem(output[_Po][_e]));
    }
    return contents;
};
const de_GetIdentityVerificationAttributesResponse = (output, context) => {
    const contents = {};
    if (String(output.VerificationAttributes).trim() === "") {
        contents[_VA] = {};
    }
    else if (output[_VA] != null && output[_VA][_e] != null) {
        contents[_VA] = de_VerificationAttributes(smithyClient.getArrayIfSingleItem(output[_VA][_e]));
    }
    return contents;
};
const de_GetSendQuotaResponse = (output, context) => {
    const contents = {};
    if (output[_MHS] != null) {
        contents[_MHS] = smithyClient.strictParseFloat(output[_MHS]);
    }
    if (output[_MSR] != null) {
        contents[_MSR] = smithyClient.strictParseFloat(output[_MSR]);
    }
    if (output[_SLH] != null) {
        contents[_SLH] = smithyClient.strictParseFloat(output[_SLH]);
    }
    return contents;
};
const de_GetSendStatisticsResponse = (output, context) => {
    const contents = {};
    if (String(output.SendDataPoints).trim() === "") {
        contents[_SDP] = [];
    }
    else if (output[_SDP] != null && output[_SDP][_me] != null) {
        contents[_SDP] = de_SendDataPointList(smithyClient.getArrayIfSingleItem(output[_SDP][_me]));
    }
    return contents;
};
const de_GetTemplateResponse = (output, context) => {
    const contents = {};
    if (output[_Te] != null) {
        contents[_Te] = de_Template(output[_Te]);
    }
    return contents;
};
const de_IdentityDkimAttributes = (output, context) => {
    const contents = {};
    if (output[_DE] != null) {
        contents[_DE] = smithyClient.parseBoolean(output[_DE]);
    }
    if (output[_DVSk] != null) {
        contents[_DVSk] = smithyClient.expectString(output[_DVSk]);
    }
    if (String(output.DkimTokens).trim() === "") {
        contents[_DTk] = [];
    }
    else if (output[_DTk] != null && output[_DTk][_me] != null) {
        contents[_DTk] = de_VerificationTokenList(smithyClient.getArrayIfSingleItem(output[_DTk][_me]));
    }
    return contents;
};
const de_IdentityList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return smithyClient.expectString(entry);
    });
};
const de_IdentityMailFromDomainAttributes = (output, context) => {
    const contents = {};
    if (output[_MFD] != null) {
        contents[_MFD] = smithyClient.expectString(output[_MFD]);
    }
    if (output[_MFDS] != null) {
        contents[_MFDS] = smithyClient.expectString(output[_MFDS]);
    }
    if (output[_BOMXF] != null) {
        contents[_BOMXF] = smithyClient.expectString(output[_BOMXF]);
    }
    return contents;
};
const de_IdentityNotificationAttributes = (output, context) => {
    const contents = {};
    if (output[_BTo] != null) {
        contents[_BTo] = smithyClient.expectString(output[_BTo]);
    }
    if (output[_CTo] != null) {
        contents[_CTo] = smithyClient.expectString(output[_CTo]);
    }
    if (output[_DTel] != null) {
        contents[_DTel] = smithyClient.expectString(output[_DTel]);
    }
    if (output[_FE] != null) {
        contents[_FE] = smithyClient.parseBoolean(output[_FE]);
    }
    if (output[_HIBNE] != null) {
        contents[_HIBNE] = smithyClient.parseBoolean(output[_HIBNE]);
    }
    if (output[_HICNE] != null) {
        contents[_HICNE] = smithyClient.parseBoolean(output[_HICNE]);
    }
    if (output[_HIDNE] != null) {
        contents[_HIDNE] = smithyClient.parseBoolean(output[_HIDNE]);
    }
    return contents;
};
const de_IdentityVerificationAttributes = (output, context) => {
    const contents = {};
    if (output[_VS] != null) {
        contents[_VS] = smithyClient.expectString(output[_VS]);
    }
    if (output[_VT] != null) {
        contents[_VT] = smithyClient.expectString(output[_VT]);
    }
    return contents;
};
const de_InvalidCloudWatchDestinationException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_EDN] != null) {
        contents[_EDN] = smithyClient.expectString(output[_EDN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidConfigurationSetException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidDeliveryOptionsException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidFirehoseDestinationException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_EDN] != null) {
        contents[_EDN] = smithyClient.expectString(output[_EDN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidLambdaFunctionException = (output, context) => {
    const contents = {};
    if (output[_FA] != null) {
        contents[_FA] = smithyClient.expectString(output[_FA]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidPolicyException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidRenderingParameterException = (output, context) => {
    const contents = {};
    if (output[_TN] != null) {
        contents[_TN] = smithyClient.expectString(output[_TN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidS3ConfigurationException = (output, context) => {
    const contents = {};
    if (output[_Bu] != null) {
        contents[_Bu] = smithyClient.expectString(output[_Bu]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidSNSDestinationException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_EDN] != null) {
        contents[_EDN] = smithyClient.expectString(output[_EDN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidSnsTopicException = (output, context) => {
    const contents = {};
    if (output[_To] != null) {
        contents[_To] = smithyClient.expectString(output[_To]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidTemplateException = (output, context) => {
    const contents = {};
    if (output[_TN] != null) {
        contents[_TN] = smithyClient.expectString(output[_TN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidTrackingOptionsException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_KinesisFirehoseDestination = (output, context) => {
    const contents = {};
    if (output[_IAMRARN] != null) {
        contents[_IAMRARN] = smithyClient.expectString(output[_IAMRARN]);
    }
    if (output[_DSARN] != null) {
        contents[_DSARN] = smithyClient.expectString(output[_DSARN]);
    }
    return contents;
};
const de_LambdaAction = (output, context) => {
    const contents = {};
    if (output[_TA] != null) {
        contents[_TA] = smithyClient.expectString(output[_TA]);
    }
    if (output[_FA] != null) {
        contents[_FA] = smithyClient.expectString(output[_FA]);
    }
    if (output[_IT] != null) {
        contents[_IT] = smithyClient.expectString(output[_IT]);
    }
    return contents;
};
const de_LimitExceededException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_ListConfigurationSetsResponse = (output, context) => {
    const contents = {};
    if (String(output.ConfigurationSets).trim() === "") {
        contents[_CSo] = [];
    }
    else if (output[_CSo] != null && output[_CSo][_me] != null) {
        contents[_CSo] = de_ConfigurationSets(smithyClient.getArrayIfSingleItem(output[_CSo][_me]));
    }
    if (output[_NT] != null) {
        contents[_NT] = smithyClient.expectString(output[_NT]);
    }
    return contents;
};
const de_ListCustomVerificationEmailTemplatesResponse = (output, context) => {
    const contents = {};
    if (String(output.CustomVerificationEmailTemplates).trim() === "") {
        contents[_CVET] = [];
    }
    else if (output[_CVET] != null && output[_CVET][_me] != null) {
        contents[_CVET] = de_CustomVerificationEmailTemplates(smithyClient.getArrayIfSingleItem(output[_CVET][_me]));
    }
    if (output[_NT] != null) {
        contents[_NT] = smithyClient.expectString(output[_NT]);
    }
    return contents;
};
const de_ListIdentitiesResponse = (output, context) => {
    const contents = {};
    if (String(output.Identities).trim() === "") {
        contents[_Id] = [];
    }
    else if (output[_Id] != null && output[_Id][_me] != null) {
        contents[_Id] = de_IdentityList(smithyClient.getArrayIfSingleItem(output[_Id][_me]));
    }
    if (output[_NT] != null) {
        contents[_NT] = smithyClient.expectString(output[_NT]);
    }
    return contents;
};
const de_ListIdentityPoliciesResponse = (output, context) => {
    const contents = {};
    if (String(output.PolicyNames).trim() === "") {
        contents[_PNo] = [];
    }
    else if (output[_PNo] != null && output[_PNo][_me] != null) {
        contents[_PNo] = de_PolicyNameList(smithyClient.getArrayIfSingleItem(output[_PNo][_me]));
    }
    return contents;
};
const de_ListReceiptFiltersResponse = (output, context) => {
    const contents = {};
    if (String(output.Filters).trim() === "") {
        contents[_Fi] = [];
    }
    else if (output[_Fi] != null && output[_Fi][_me] != null) {
        contents[_Fi] = de_ReceiptFilterList(smithyClient.getArrayIfSingleItem(output[_Fi][_me]));
    }
    return contents;
};
const de_ListReceiptRuleSetsResponse = (output, context) => {
    const contents = {};
    if (String(output.RuleSets).trim() === "") {
        contents[_RS] = [];
    }
    else if (output[_RS] != null && output[_RS][_me] != null) {
        contents[_RS] = de_ReceiptRuleSetsLists(smithyClient.getArrayIfSingleItem(output[_RS][_me]));
    }
    if (output[_NT] != null) {
        contents[_NT] = smithyClient.expectString(output[_NT]);
    }
    return contents;
};
const de_ListTemplatesResponse = (output, context) => {
    const contents = {};
    if (String(output.TemplatesMetadata).trim() === "") {
        contents[_TM] = [];
    }
    else if (output[_TM] != null && output[_TM][_me] != null) {
        contents[_TM] = de_TemplateMetadataList(smithyClient.getArrayIfSingleItem(output[_TM][_me]));
    }
    if (output[_NT] != null) {
        contents[_NT] = smithyClient.expectString(output[_NT]);
    }
    return contents;
};
const de_ListVerifiedEmailAddressesResponse = (output, context) => {
    const contents = {};
    if (String(output.VerifiedEmailAddresses).trim() === "") {
        contents[_VEAe] = [];
    }
    else if (output[_VEAe] != null && output[_VEAe][_me] != null) {
        contents[_VEAe] = de_AddressList(smithyClient.getArrayIfSingleItem(output[_VEAe][_me]));
    }
    return contents;
};
const de_MailFromDomainAttributes = (output, context) => {
    return output.reduce((acc, pair) => {
        if (pair["value"] === null) {
            return acc;
        }
        acc[pair["key"]] = de_IdentityMailFromDomainAttributes(pair["value"]);
        return acc;
    }, {});
};
const de_MailFromDomainNotVerifiedException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_MessageRejected = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_MissingRenderingAttributeException = (output, context) => {
    const contents = {};
    if (output[_TN] != null) {
        contents[_TN] = smithyClient.expectString(output[_TN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_NotificationAttributes = (output, context) => {
    return output.reduce((acc, pair) => {
        if (pair["value"] === null) {
            return acc;
        }
        acc[pair["key"]] = de_IdentityNotificationAttributes(pair["value"]);
        return acc;
    }, {});
};
const de_PolicyMap = (output, context) => {
    return output.reduce((acc, pair) => {
        if (pair["value"] === null) {
            return acc;
        }
        acc[pair["key"]] = smithyClient.expectString(pair["value"]);
        return acc;
    }, {});
};
const de_PolicyNameList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return smithyClient.expectString(entry);
    });
};
const de_ProductionAccessNotGrantedException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_PutConfigurationSetDeliveryOptionsResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_PutIdentityPolicyResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_ReceiptAction = (output, context) => {
    const contents = {};
    if (output[_SA] != null) {
        contents[_SA] = de_S3Action(output[_SA]);
    }
    if (output[_BAo] != null) {
        contents[_BAo] = de_BounceAction(output[_BAo]);
    }
    if (output[_WA] != null) {
        contents[_WA] = de_WorkmailAction(output[_WA]);
    }
    if (output[_LA] != null) {
        contents[_LA] = de_LambdaAction(output[_LA]);
    }
    if (output[_SAt] != null) {
        contents[_SAt] = de_StopAction(output[_SAt]);
    }
    if (output[_AHA] != null) {
        contents[_AHA] = de_AddHeaderAction(output[_AHA]);
    }
    if (output[_SNSA] != null) {
        contents[_SNSA] = de_SNSAction(output[_SNSA]);
    }
    if (output[_CAo] != null) {
        contents[_CAo] = de_ConnectAction(output[_CAo]);
    }
    return contents;
};
const de_ReceiptActionsList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_ReceiptAction(entry);
    });
};
const de_ReceiptFilter = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_IF] != null) {
        contents[_IF] = de_ReceiptIpFilter(output[_IF]);
    }
    return contents;
};
const de_ReceiptFilterList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_ReceiptFilter(entry);
    });
};
const de_ReceiptIpFilter = (output, context) => {
    const contents = {};
    if (output[_P] != null) {
        contents[_P] = smithyClient.expectString(output[_P]);
    }
    if (output[_Ci] != null) {
        contents[_Ci] = smithyClient.expectString(output[_Ci]);
    }
    return contents;
};
const de_ReceiptRule = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_E] != null) {
        contents[_E] = smithyClient.parseBoolean(output[_E]);
    }
    if (output[_TP] != null) {
        contents[_TP] = smithyClient.expectString(output[_TP]);
    }
    if (String(output.Recipients).trim() === "") {
        contents[_Re] = [];
    }
    else if (output[_Re] != null && output[_Re][_me] != null) {
        contents[_Re] = de_RecipientsList(smithyClient.getArrayIfSingleItem(output[_Re][_me]));
    }
    if (String(output.Actions).trim() === "") {
        contents[_Ac] = [];
    }
    else if (output[_Ac] != null && output[_Ac][_me] != null) {
        contents[_Ac] = de_ReceiptActionsList(smithyClient.getArrayIfSingleItem(output[_Ac][_me]));
    }
    if (output[_SEc] != null) {
        contents[_SEc] = smithyClient.parseBoolean(output[_SEc]);
    }
    return contents;
};
const de_ReceiptRuleSetMetadata = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_CTr] != null) {
        contents[_CTr] = smithyClient.expectNonNull(smithyClient.parseRfc3339DateTimeWithOffset(output[_CTr]));
    }
    return contents;
};
const de_ReceiptRuleSetsLists = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_ReceiptRuleSetMetadata(entry);
    });
};
const de_ReceiptRulesList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_ReceiptRule(entry);
    });
};
const de_RecipientsList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return smithyClient.expectString(entry);
    });
};
const de_ReorderReceiptRuleSetResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_ReputationOptions = (output, context) => {
    const contents = {};
    if (output[_SEe] != null) {
        contents[_SEe] = smithyClient.parseBoolean(output[_SEe]);
    }
    if (output[_RME] != null) {
        contents[_RME] = smithyClient.parseBoolean(output[_RME]);
    }
    if (output[_LFS] != null) {
        contents[_LFS] = smithyClient.expectNonNull(smithyClient.parseRfc3339DateTimeWithOffset(output[_LFS]));
    }
    return contents;
};
const de_RuleDoesNotExistException = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_RuleSetDoesNotExistException = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_S3Action = (output, context) => {
    const contents = {};
    if (output[_TA] != null) {
        contents[_TA] = smithyClient.expectString(output[_TA]);
    }
    if (output[_BN] != null) {
        contents[_BN] = smithyClient.expectString(output[_BN]);
    }
    if (output[_OKP] != null) {
        contents[_OKP] = smithyClient.expectString(output[_OKP]);
    }
    if (output[_KKA] != null) {
        contents[_KKA] = smithyClient.expectString(output[_KKA]);
    }
    if (output[_IRA] != null) {
        contents[_IRA] = smithyClient.expectString(output[_IRA]);
    }
    return contents;
};
const de_SendBounceResponse = (output, context) => {
    const contents = {};
    if (output[_MIe] != null) {
        contents[_MIe] = smithyClient.expectString(output[_MIe]);
    }
    return contents;
};
const de_SendBulkTemplatedEmailResponse = (output, context) => {
    const contents = {};
    if (String(output.Status).trim() === "") {
        contents[_St] = [];
    }
    else if (output[_St] != null && output[_St][_me] != null) {
        contents[_St] = de_BulkEmailDestinationStatusList(smithyClient.getArrayIfSingleItem(output[_St][_me]));
    }
    return contents;
};
const de_SendCustomVerificationEmailResponse = (output, context) => {
    const contents = {};
    if (output[_MIe] != null) {
        contents[_MIe] = smithyClient.expectString(output[_MIe]);
    }
    return contents;
};
const de_SendDataPoint = (output, context) => {
    const contents = {};
    if (output[_Ti] != null) {
        contents[_Ti] = smithyClient.expectNonNull(smithyClient.parseRfc3339DateTimeWithOffset(output[_Ti]));
    }
    if (output[_DAe] != null) {
        contents[_DAe] = smithyClient.strictParseLong(output[_DAe]);
    }
    if (output[_Bo] != null) {
        contents[_Bo] = smithyClient.strictParseLong(output[_Bo]);
    }
    if (output[_Co] != null) {
        contents[_Co] = smithyClient.strictParseLong(output[_Co]);
    }
    if (output[_Rej] != null) {
        contents[_Rej] = smithyClient.strictParseLong(output[_Rej]);
    }
    return contents;
};
const de_SendDataPointList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_SendDataPoint(entry);
    });
};
const de_SendEmailResponse = (output, context) => {
    const contents = {};
    if (output[_MIe] != null) {
        contents[_MIe] = smithyClient.expectString(output[_MIe]);
    }
    return contents;
};
const de_SendRawEmailResponse = (output, context) => {
    const contents = {};
    if (output[_MIe] != null) {
        contents[_MIe] = smithyClient.expectString(output[_MIe]);
    }
    return contents;
};
const de_SendTemplatedEmailResponse = (output, context) => {
    const contents = {};
    if (output[_MIe] != null) {
        contents[_MIe] = smithyClient.expectString(output[_MIe]);
    }
    return contents;
};
const de_SetActiveReceiptRuleSetResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_SetIdentityDkimEnabledResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_SetIdentityFeedbackForwardingEnabledResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_SetIdentityHeadersInNotificationsEnabledResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_SetIdentityMailFromDomainResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_SetIdentityNotificationTopicResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_SetReceiptRulePositionResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_SNSAction = (output, context) => {
    const contents = {};
    if (output[_TA] != null) {
        contents[_TA] = smithyClient.expectString(output[_TA]);
    }
    if (output[_En] != null) {
        contents[_En] = smithyClient.expectString(output[_En]);
    }
    return contents;
};
const de_SNSDestination = (output, context) => {
    const contents = {};
    if (output[_TARN] != null) {
        contents[_TARN] = smithyClient.expectString(output[_TARN]);
    }
    return contents;
};
const de_StopAction = (output, context) => {
    const contents = {};
    if (output[_Sc] != null) {
        contents[_Sc] = smithyClient.expectString(output[_Sc]);
    }
    if (output[_TA] != null) {
        contents[_TA] = smithyClient.expectString(output[_TA]);
    }
    return contents;
};
const de_Template = (output, context) => {
    const contents = {};
    if (output[_TN] != null) {
        contents[_TN] = smithyClient.expectString(output[_TN]);
    }
    if (output[_SP] != null) {
        contents[_SP] = smithyClient.expectString(output[_SP]);
    }
    if (output[_TPe] != null) {
        contents[_TPe] = smithyClient.expectString(output[_TPe]);
    }
    if (output[_HP] != null) {
        contents[_HP] = smithyClient.expectString(output[_HP]);
    }
    return contents;
};
const de_TemplateDoesNotExistException = (output, context) => {
    const contents = {};
    if (output[_TN] != null) {
        contents[_TN] = smithyClient.expectString(output[_TN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_TemplateMetadata = (output, context) => {
    const contents = {};
    if (output[_N] != null) {
        contents[_N] = smithyClient.expectString(output[_N]);
    }
    if (output[_CTr] != null) {
        contents[_CTr] = smithyClient.expectNonNull(smithyClient.parseRfc3339DateTimeWithOffset(output[_CTr]));
    }
    return contents;
};
const de_TemplateMetadataList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_TemplateMetadata(entry);
    });
};
const de_TestRenderTemplateResponse = (output, context) => {
    const contents = {};
    if (output[_RTe] != null) {
        contents[_RTe] = smithyClient.expectString(output[_RTe]);
    }
    return contents;
};
const de_TrackingOptions = (output, context) => {
    const contents = {};
    if (output[_CRD] != null) {
        contents[_CRD] = smithyClient.expectString(output[_CRD]);
    }
    return contents;
};
const de_TrackingOptionsAlreadyExistsException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_TrackingOptionsDoesNotExistException = (output, context) => {
    const contents = {};
    if (output[_CSN] != null) {
        contents[_CSN] = smithyClient.expectString(output[_CSN]);
    }
    if (output[_m] != null) {
        contents[_m] = smithyClient.expectString(output[_m]);
    }
    return contents;
};
const de_UpdateConfigurationSetEventDestinationResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_UpdateConfigurationSetTrackingOptionsResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_UpdateReceiptRuleResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_UpdateTemplateResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_VerificationAttributes = (output, context) => {
    return output.reduce((acc, pair) => {
        if (pair["value"] === null) {
            return acc;
        }
        acc[pair["key"]] = de_IdentityVerificationAttributes(pair["value"]);
        return acc;
    }, {});
};
const de_VerificationTokenList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return smithyClient.expectString(entry);
    });
};
const de_VerifyDomainDkimResponse = (output, context) => {
    const contents = {};
    if (String(output.DkimTokens).trim() === "") {
        contents[_DTk] = [];
    }
    else if (output[_DTk] != null && output[_DTk][_me] != null) {
        contents[_DTk] = de_VerificationTokenList(smithyClient.getArrayIfSingleItem(output[_DTk][_me]));
    }
    return contents;
};
const de_VerifyDomainIdentityResponse = (output, context) => {
    const contents = {};
    if (output[_VT] != null) {
        contents[_VT] = smithyClient.expectString(output[_VT]);
    }
    return contents;
};
const de_VerifyEmailIdentityResponse = (output, context) => {
    const contents = {};
    return contents;
};
const de_WorkmailAction = (output, context) => {
    const contents = {};
    if (output[_TA] != null) {
        contents[_TA] = smithyClient.expectString(output[_TA]);
    }
    if (output[_OA] != null) {
        contents[_OA] = smithyClient.expectString(output[_OA]);
    }
    return contents;
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const throwDefaultError = smithyClient.withBaseException(SESServiceException);
const buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers,
    };
    if (body !== undefined) {
        contents.body = body;
    }
    return new protocolHttp.HttpRequest(contents);
};
const SHARED_HEADERS = {
    "content-type": "application/x-www-form-urlencoded",
};
const _ = "2010-12-01";
const _A = "Action";
const _AD = "ArrivalDate";
const _AHA = "AddHeaderAction";
const _Ac = "Actions";
const _Af = "After";
const _B = "Body";
const _BA = "BccAddresses";
const _BAo = "BounceAction";
const _BN = "BucketName";
const _BOMXF = "BehaviorOnMXFailure";
const _BRIL = "BouncedRecipientInfoList";
const _BS = "BounceSender";
const _BSA = "BounceSenderArn";
const _BT = "BounceType";
const _BTo = "BounceTopic";
const _Bo = "Bounces";
const _Bu = "Bucket";
const _C = "Charset";
const _CA = "CcAddresses";
const _CAo = "ConnectAction";
const _CCS = "CreateConfigurationSet";
const _CCSED = "CreateConfigurationSetEventDestination";
const _CCSTO = "CreateConfigurationSetTrackingOptions";
const _CCVET = "CreateCustomVerificationEmailTemplate";
const _CRD = "CustomRedirectDomain";
const _CRF = "CreateReceiptFilter";
const _CRR = "CreateReceiptRule";
const _CRRS = "CloneReceiptRuleSet";
const _CRRSr = "CreateReceiptRuleSet";
const _CS = "ConfigurationSet";
const _CSAN = "ConfigurationSetAttributeNames";
const _CSN = "ConfigurationSetName";
const _CSo = "ConfigurationSets";
const _CT = "CreateTemplate";
const _CTo = "ComplaintTopic";
const _CTr = "CreatedTimestamp";
const _CVET = "CustomVerificationEmailTemplates";
const _CVETN = "CustomVerificationEmailTemplateName";
const _CWD = "CloudWatchDestination";
const _Ci = "Cidr";
const _Co = "Complaints";
const _D = "Destination";
const _DA = "DkimAttributes";
const _DARRS = "DescribeActiveReceiptRuleSet";
const _DAe = "DeliveryAttempts";
const _DC = "DimensionConfigurations";
const _DCS = "DeleteConfigurationSet";
const _DCSED = "DeleteConfigurationSetEventDestination";
const _DCSTO = "DeleteConfigurationSetTrackingOptions";
const _DCSe = "DescribeConfigurationSet";
const _DCVET = "DeleteCustomVerificationEmailTemplate";
const _DCi = "DiagnosticCode";
const _DDV = "DefaultDimensionValue";
const _DE = "DkimEnabled";
const _DI = "DeleteIdentity";
const _DIP = "DeleteIdentityPolicy";
const _DN = "DimensionName";
const _DO = "DeliveryOptions";
const _DRF = "DeleteReceiptFilter";
const _DRR = "DeleteReceiptRule";
const _DRRS = "DeleteReceiptRuleSet";
const _DRRSe = "DescribeReceiptRuleSet";
const _DRRe = "DescribeReceiptRule";
const _DSARN = "DeliveryStreamARN";
const _DT = "DeleteTemplate";
const _DTD = "DefaultTemplateData";
const _DTe = "DefaultTags";
const _DTel = "DeliveryTopic";
const _DTk = "DkimTokens";
const _DVEA = "DeleteVerifiedEmailAddress";
const _DVS = "DimensionValueSource";
const _DVSk = "DkimVerificationStatus";
const _Da = "Data";
const _De = "Destinations";
const _Do = "Domain";
const _E = "Enabled";
const _EA = "EmailAddress";
const _ED = "EventDestination";
const _EDN = "EventDestinationName";
const _EDv = "EventDestinations";
const _EF = "ExtensionFields";
const _En = "Encoding";
const _Er = "Error";
const _Ex = "Explanation";
const _F = "Filter";
const _FA = "FunctionArn";
const _FAr = "FromArn";
const _FE = "ForwardingEnabled";
const _FEA = "FromEmailAddress";
const _FN = "FilterName";
const _FR = "FinalRecipient";
const _FRURL = "FailureRedirectionURL";
const _Fi = "Filters";
const _GASE = "GetAccountSendingEnabled";
const _GCVET = "GetCustomVerificationEmailTemplate";
const _GIDA = "GetIdentityDkimAttributes";
const _GIMFDA = "GetIdentityMailFromDomainAttributes";
const _GINA = "GetIdentityNotificationAttributes";
const _GIP = "GetIdentityPolicies";
const _GIVA = "GetIdentityVerificationAttributes";
const _GSQ = "GetSendQuota";
const _GSS = "GetSendStatistics";
const _GT = "GetTemplate";
const _H = "Html";
const _HIBNE = "HeadersInBounceNotificationsEnabled";
const _HICNE = "HeadersInComplaintNotificationsEnabled";
const _HIDNE = "HeadersInDeliveryNotificationsEnabled";
const _HN = "HeaderName";
const _HP = "HtmlPart";
const _HV = "HeaderValue";
const _I = "Identity";
const _IAMRARN = "IAMRoleARN";
const _IARN = "InstanceARN";
const _IF = "IpFilter";
const _IRA = "IamRoleArn";
const _IT = "InvocationType";
const _ITd = "IdentityType";
const _Id = "Identities";
const _KFD = "KinesisFirehoseDestination";
const _KKA = "KmsKeyArn";
const _LA = "LambdaAction";
const _LAD = "LastAttemptDate";
const _LCS = "ListConfigurationSets";
const _LCVET = "ListCustomVerificationEmailTemplates";
const _LFS = "LastFreshStart";
const _LI = "ListIdentities";
const _LIP = "ListIdentityPolicies";
const _LRF = "ListReceiptFilters";
const _LRRS = "ListReceiptRuleSets";
const _LT = "ListTemplates";
const _LVEA = "ListVerifiedEmailAddresses";
const _M = "Message";
const _MD = "MessageDsn";
const _MET = "MatchingEventTypes";
const _MFD = "MailFromDomain";
const _MFDA = "MailFromDomainAttributes";
const _MFDS = "MailFromDomainStatus";
const _MHS = "Max24HourSend";
const _MI = "MaxItems";
const _MIe = "MessageId";
const _MR = "MaxResults";
const _MSR = "MaxSendRate";
const _Me = "Metadata";
const _N = "Name";
const _NA = "NotificationAttributes";
const _NT = "NextToken";
const _NTo = "NotificationType";
const _OA = "OrganizationArn";
const _OKP = "ObjectKeyPrefix";
const _OMI = "OriginalMessageId";
const _ORSN = "OriginalRuleSetName";
const _P = "Policy";
const _PCSDO = "PutConfigurationSetDeliveryOptions";
const _PIP = "PutIdentityPolicy";
const _PN = "PolicyName";
const _PNo = "PolicyNames";
const _Po = "Policies";
const _R = "Recipient";
const _RA = "RecipientArn";
const _RDF = "RecipientDsnFields";
const _RM = "ReportingMta";
const _RME = "ReputationMetricsEnabled";
const _RMa = "RawMessage";
const _RMe = "RemoteMta";
const _RN = "RuleName";
const _RNu = "RuleNames";
const _RO = "ReputationOptions";
const _RP = "ReturnPath";
const _RPA = "ReturnPathArn";
const _RRRS = "ReorderReceiptRuleSet";
const _RS = "RuleSets";
const _RSN = "RuleSetName";
const _RT = "ReplacementTags";
const _RTA = "ReplyToAddresses";
const _RTD = "ReplacementTemplateData";
const _RTe = "RenderedTemplate";
const _Re = "Recipients";
const _Rej = "Rejects";
const _Ru = "Rule";
const _Rul = "Rules";
const _S = "Sender";
const _SA = "S3Action";
const _SARRS = "SetActiveReceiptRuleSet";
const _SAo = "SourceArn";
const _SAt = "StopAction";
const _SB = "SendBounce";
const _SBTE = "SendBulkTemplatedEmail";
const _SC = "StatusCode";
const _SCVE = "SendCustomVerificationEmail";
const _SDP = "SendDataPoints";
const _SE = "SendEmail";
const _SEc = "ScanEnabled";
const _SEe = "SendingEnabled";
const _SIDE = "SetIdentityDkimEnabled";
const _SIFFE = "SetIdentityFeedbackForwardingEnabled";
const _SIHINE = "SetIdentityHeadersInNotificationsEnabled";
const _SIMFD = "SetIdentityMailFromDomain";
const _SINT = "SetIdentityNotificationTopic";
const _SLH = "SentLast24Hours";
const _SNSA = "SNSAction";
const _SNSD = "SNSDestination";
const _SP = "SubjectPart";
const _SRC = "SmtpReplyCode";
const _SRE = "SendRawEmail";
const _SRRP = "SetReceiptRulePosition";
const _SRURL = "SuccessRedirectionURL";
const _ST = "SnsTopic";
const _STE = "SendTemplatedEmail";
const _Sc = "Scope";
const _So = "Source";
const _St = "Status";
const _Su = "Subject";
const _T = "Text";
const _TA = "TopicArn";
const _TARN = "TopicARN";
const _TAe = "TemplateArn";
const _TAo = "ToAddresses";
const _TC = "TemplateContent";
const _TD = "TemplateData";
const _TM = "TemplatesMetadata";
const _TN = "TemplateName";
const _TO = "TrackingOptions";
const _TP = "TlsPolicy";
const _TPe = "TextPart";
const _TRT = "TestRenderTemplate";
const _TS = "TemplateSubject";
const _Ta = "Tags";
const _Te = "Template";
const _Ti = "Timestamp";
const _To = "Topic";
const _UASE = "UpdateAccountSendingEnabled";
const _UCSED = "UpdateConfigurationSetEventDestination";
const _UCSRME = "UpdateConfigurationSetReputationMetricsEnabled";
const _UCSSE = "UpdateConfigurationSetSendingEnabled";
const _UCSTO = "UpdateConfigurationSetTrackingOptions";
const _UCVET = "UpdateCustomVerificationEmailTemplate";
const _URR = "UpdateReceiptRule";
const _UT = "UpdateTemplate";
const _V = "Version";
const _VA = "VerificationAttributes";
const _VDD = "VerifyDomainDkim";
const _VDI = "VerifyDomainIdentity";
const _VEA = "VerifyEmailAddress";
const _VEAe = "VerifiedEmailAddresses";
const _VEI = "VerifyEmailIdentity";
const _VS = "VerificationStatus";
const _VT = "VerificationToken";
const _Va = "Value";
const _WA = "WorkmailAction";
const _e = "entry";
const _m = "message";
const _me = "member";
const buildFormUrlencodedString = (formEntries) => Object.entries(formEntries)
    .map(([key, value]) => smithyClient.extendedEncodeURIComponent(key) + "=" + smithyClient.extendedEncodeURIComponent(value))
    .join("&");
const loadQueryErrorCode = (output, data) => {
    if (data.Error?.Code !== undefined) {
        return data.Error.Code;
    }
    if (output.statusCode == 404) {
        return "NotFound";
    }
};

class CloneReceiptRuleSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CloneReceiptRuleSet", {})
    .n("SESClient", "CloneReceiptRuleSetCommand")
    .f(void 0, void 0)
    .ser(se_CloneReceiptRuleSetCommand)
    .de(de_CloneReceiptRuleSetCommand)
    .build() {
}

class CreateConfigurationSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CreateConfigurationSet", {})
    .n("SESClient", "CreateConfigurationSetCommand")
    .f(void 0, void 0)
    .ser(se_CreateConfigurationSetCommand)
    .de(de_CreateConfigurationSetCommand)
    .build() {
}

class CreateConfigurationSetEventDestinationCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CreateConfigurationSetEventDestination", {})
    .n("SESClient", "CreateConfigurationSetEventDestinationCommand")
    .f(void 0, void 0)
    .ser(se_CreateConfigurationSetEventDestinationCommand)
    .de(de_CreateConfigurationSetEventDestinationCommand)
    .build() {
}

class CreateConfigurationSetTrackingOptionsCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CreateConfigurationSetTrackingOptions", {})
    .n("SESClient", "CreateConfigurationSetTrackingOptionsCommand")
    .f(void 0, void 0)
    .ser(se_CreateConfigurationSetTrackingOptionsCommand)
    .de(de_CreateConfigurationSetTrackingOptionsCommand)
    .build() {
}

class CreateCustomVerificationEmailTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CreateCustomVerificationEmailTemplate", {})
    .n("SESClient", "CreateCustomVerificationEmailTemplateCommand")
    .f(void 0, void 0)
    .ser(se_CreateCustomVerificationEmailTemplateCommand)
    .de(de_CreateCustomVerificationEmailTemplateCommand)
    .build() {
}

class CreateReceiptFilterCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CreateReceiptFilter", {})
    .n("SESClient", "CreateReceiptFilterCommand")
    .f(void 0, void 0)
    .ser(se_CreateReceiptFilterCommand)
    .de(de_CreateReceiptFilterCommand)
    .build() {
}

class CreateReceiptRuleCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CreateReceiptRule", {})
    .n("SESClient", "CreateReceiptRuleCommand")
    .f(void 0, void 0)
    .ser(se_CreateReceiptRuleCommand)
    .de(de_CreateReceiptRuleCommand)
    .build() {
}

class CreateReceiptRuleSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CreateReceiptRuleSet", {})
    .n("SESClient", "CreateReceiptRuleSetCommand")
    .f(void 0, void 0)
    .ser(se_CreateReceiptRuleSetCommand)
    .de(de_CreateReceiptRuleSetCommand)
    .build() {
}

class CreateTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "CreateTemplate", {})
    .n("SESClient", "CreateTemplateCommand")
    .f(void 0, void 0)
    .ser(se_CreateTemplateCommand)
    .de(de_CreateTemplateCommand)
    .build() {
}

class DeleteConfigurationSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteConfigurationSet", {})
    .n("SESClient", "DeleteConfigurationSetCommand")
    .f(void 0, void 0)
    .ser(se_DeleteConfigurationSetCommand)
    .de(de_DeleteConfigurationSetCommand)
    .build() {
}

class DeleteConfigurationSetEventDestinationCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteConfigurationSetEventDestination", {})
    .n("SESClient", "DeleteConfigurationSetEventDestinationCommand")
    .f(void 0, void 0)
    .ser(se_DeleteConfigurationSetEventDestinationCommand)
    .de(de_DeleteConfigurationSetEventDestinationCommand)
    .build() {
}

class DeleteConfigurationSetTrackingOptionsCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteConfigurationSetTrackingOptions", {})
    .n("SESClient", "DeleteConfigurationSetTrackingOptionsCommand")
    .f(void 0, void 0)
    .ser(se_DeleteConfigurationSetTrackingOptionsCommand)
    .de(de_DeleteConfigurationSetTrackingOptionsCommand)
    .build() {
}

class DeleteCustomVerificationEmailTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteCustomVerificationEmailTemplate", {})
    .n("SESClient", "DeleteCustomVerificationEmailTemplateCommand")
    .f(void 0, void 0)
    .ser(se_DeleteCustomVerificationEmailTemplateCommand)
    .de(de_DeleteCustomVerificationEmailTemplateCommand)
    .build() {
}

class DeleteIdentityCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteIdentity", {})
    .n("SESClient", "DeleteIdentityCommand")
    .f(void 0, void 0)
    .ser(se_DeleteIdentityCommand)
    .de(de_DeleteIdentityCommand)
    .build() {
}

class DeleteIdentityPolicyCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteIdentityPolicy", {})
    .n("SESClient", "DeleteIdentityPolicyCommand")
    .f(void 0, void 0)
    .ser(se_DeleteIdentityPolicyCommand)
    .de(de_DeleteIdentityPolicyCommand)
    .build() {
}

class DeleteReceiptFilterCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteReceiptFilter", {})
    .n("SESClient", "DeleteReceiptFilterCommand")
    .f(void 0, void 0)
    .ser(se_DeleteReceiptFilterCommand)
    .de(de_DeleteReceiptFilterCommand)
    .build() {
}

class DeleteReceiptRuleCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteReceiptRule", {})
    .n("SESClient", "DeleteReceiptRuleCommand")
    .f(void 0, void 0)
    .ser(se_DeleteReceiptRuleCommand)
    .de(de_DeleteReceiptRuleCommand)
    .build() {
}

class DeleteReceiptRuleSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteReceiptRuleSet", {})
    .n("SESClient", "DeleteReceiptRuleSetCommand")
    .f(void 0, void 0)
    .ser(se_DeleteReceiptRuleSetCommand)
    .de(de_DeleteReceiptRuleSetCommand)
    .build() {
}

class DeleteTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteTemplate", {})
    .n("SESClient", "DeleteTemplateCommand")
    .f(void 0, void 0)
    .ser(se_DeleteTemplateCommand)
    .de(de_DeleteTemplateCommand)
    .build() {
}

class DeleteVerifiedEmailAddressCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DeleteVerifiedEmailAddress", {})
    .n("SESClient", "DeleteVerifiedEmailAddressCommand")
    .f(void 0, void 0)
    .ser(se_DeleteVerifiedEmailAddressCommand)
    .de(de_DeleteVerifiedEmailAddressCommand)
    .build() {
}

class DescribeActiveReceiptRuleSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DescribeActiveReceiptRuleSet", {})
    .n("SESClient", "DescribeActiveReceiptRuleSetCommand")
    .f(void 0, void 0)
    .ser(se_DescribeActiveReceiptRuleSetCommand)
    .de(de_DescribeActiveReceiptRuleSetCommand)
    .build() {
}

class DescribeConfigurationSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DescribeConfigurationSet", {})
    .n("SESClient", "DescribeConfigurationSetCommand")
    .f(void 0, void 0)
    .ser(se_DescribeConfigurationSetCommand)
    .de(de_DescribeConfigurationSetCommand)
    .build() {
}

class DescribeReceiptRuleCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DescribeReceiptRule", {})
    .n("SESClient", "DescribeReceiptRuleCommand")
    .f(void 0, void 0)
    .ser(se_DescribeReceiptRuleCommand)
    .de(de_DescribeReceiptRuleCommand)
    .build() {
}

class DescribeReceiptRuleSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "DescribeReceiptRuleSet", {})
    .n("SESClient", "DescribeReceiptRuleSetCommand")
    .f(void 0, void 0)
    .ser(se_DescribeReceiptRuleSetCommand)
    .de(de_DescribeReceiptRuleSetCommand)
    .build() {
}

class GetAccountSendingEnabledCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetAccountSendingEnabled", {})
    .n("SESClient", "GetAccountSendingEnabledCommand")
    .f(void 0, void 0)
    .ser(se_GetAccountSendingEnabledCommand)
    .de(de_GetAccountSendingEnabledCommand)
    .build() {
}

class GetCustomVerificationEmailTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetCustomVerificationEmailTemplate", {})
    .n("SESClient", "GetCustomVerificationEmailTemplateCommand")
    .f(void 0, void 0)
    .ser(se_GetCustomVerificationEmailTemplateCommand)
    .de(de_GetCustomVerificationEmailTemplateCommand)
    .build() {
}

class GetIdentityDkimAttributesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetIdentityDkimAttributes", {})
    .n("SESClient", "GetIdentityDkimAttributesCommand")
    .f(void 0, void 0)
    .ser(se_GetIdentityDkimAttributesCommand)
    .de(de_GetIdentityDkimAttributesCommand)
    .build() {
}

class GetIdentityMailFromDomainAttributesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetIdentityMailFromDomainAttributes", {})
    .n("SESClient", "GetIdentityMailFromDomainAttributesCommand")
    .f(void 0, void 0)
    .ser(se_GetIdentityMailFromDomainAttributesCommand)
    .de(de_GetIdentityMailFromDomainAttributesCommand)
    .build() {
}

class GetIdentityNotificationAttributesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetIdentityNotificationAttributes", {})
    .n("SESClient", "GetIdentityNotificationAttributesCommand")
    .f(void 0, void 0)
    .ser(se_GetIdentityNotificationAttributesCommand)
    .de(de_GetIdentityNotificationAttributesCommand)
    .build() {
}

class GetIdentityPoliciesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetIdentityPolicies", {})
    .n("SESClient", "GetIdentityPoliciesCommand")
    .f(void 0, void 0)
    .ser(se_GetIdentityPoliciesCommand)
    .de(de_GetIdentityPoliciesCommand)
    .build() {
}

class GetIdentityVerificationAttributesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetIdentityVerificationAttributes", {})
    .n("SESClient", "GetIdentityVerificationAttributesCommand")
    .f(void 0, void 0)
    .ser(se_GetIdentityVerificationAttributesCommand)
    .de(de_GetIdentityVerificationAttributesCommand)
    .build() {
}

class GetSendQuotaCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetSendQuota", {})
    .n("SESClient", "GetSendQuotaCommand")
    .f(void 0, void 0)
    .ser(se_GetSendQuotaCommand)
    .de(de_GetSendQuotaCommand)
    .build() {
}

class GetSendStatisticsCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetSendStatistics", {})
    .n("SESClient", "GetSendStatisticsCommand")
    .f(void 0, void 0)
    .ser(se_GetSendStatisticsCommand)
    .de(de_GetSendStatisticsCommand)
    .build() {
}

class GetTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "GetTemplate", {})
    .n("SESClient", "GetTemplateCommand")
    .f(void 0, void 0)
    .ser(se_GetTemplateCommand)
    .de(de_GetTemplateCommand)
    .build() {
}

class ListConfigurationSetsCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ListConfigurationSets", {})
    .n("SESClient", "ListConfigurationSetsCommand")
    .f(void 0, void 0)
    .ser(se_ListConfigurationSetsCommand)
    .de(de_ListConfigurationSetsCommand)
    .build() {
}

class ListCustomVerificationEmailTemplatesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ListCustomVerificationEmailTemplates", {})
    .n("SESClient", "ListCustomVerificationEmailTemplatesCommand")
    .f(void 0, void 0)
    .ser(se_ListCustomVerificationEmailTemplatesCommand)
    .de(de_ListCustomVerificationEmailTemplatesCommand)
    .build() {
}

class ListIdentitiesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ListIdentities", {})
    .n("SESClient", "ListIdentitiesCommand")
    .f(void 0, void 0)
    .ser(se_ListIdentitiesCommand)
    .de(de_ListIdentitiesCommand)
    .build() {
}

class ListIdentityPoliciesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ListIdentityPolicies", {})
    .n("SESClient", "ListIdentityPoliciesCommand")
    .f(void 0, void 0)
    .ser(se_ListIdentityPoliciesCommand)
    .de(de_ListIdentityPoliciesCommand)
    .build() {
}

class ListReceiptFiltersCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ListReceiptFilters", {})
    .n("SESClient", "ListReceiptFiltersCommand")
    .f(void 0, void 0)
    .ser(se_ListReceiptFiltersCommand)
    .de(de_ListReceiptFiltersCommand)
    .build() {
}

class ListReceiptRuleSetsCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ListReceiptRuleSets", {})
    .n("SESClient", "ListReceiptRuleSetsCommand")
    .f(void 0, void 0)
    .ser(se_ListReceiptRuleSetsCommand)
    .de(de_ListReceiptRuleSetsCommand)
    .build() {
}

class ListTemplatesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ListTemplates", {})
    .n("SESClient", "ListTemplatesCommand")
    .f(void 0, void 0)
    .ser(se_ListTemplatesCommand)
    .de(de_ListTemplatesCommand)
    .build() {
}

class ListVerifiedEmailAddressesCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ListVerifiedEmailAddresses", {})
    .n("SESClient", "ListVerifiedEmailAddressesCommand")
    .f(void 0, void 0)
    .ser(se_ListVerifiedEmailAddressesCommand)
    .de(de_ListVerifiedEmailAddressesCommand)
    .build() {
}

class PutConfigurationSetDeliveryOptionsCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "PutConfigurationSetDeliveryOptions", {})
    .n("SESClient", "PutConfigurationSetDeliveryOptionsCommand")
    .f(void 0, void 0)
    .ser(se_PutConfigurationSetDeliveryOptionsCommand)
    .de(de_PutConfigurationSetDeliveryOptionsCommand)
    .build() {
}

class PutIdentityPolicyCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "PutIdentityPolicy", {})
    .n("SESClient", "PutIdentityPolicyCommand")
    .f(void 0, void 0)
    .ser(se_PutIdentityPolicyCommand)
    .de(de_PutIdentityPolicyCommand)
    .build() {
}

class ReorderReceiptRuleSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "ReorderReceiptRuleSet", {})
    .n("SESClient", "ReorderReceiptRuleSetCommand")
    .f(void 0, void 0)
    .ser(se_ReorderReceiptRuleSetCommand)
    .de(de_ReorderReceiptRuleSetCommand)
    .build() {
}

class SendBounceCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SendBounce", {})
    .n("SESClient", "SendBounceCommand")
    .f(void 0, void 0)
    .ser(se_SendBounceCommand)
    .de(de_SendBounceCommand)
    .build() {
}

class SendBulkTemplatedEmailCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SendBulkTemplatedEmail", {})
    .n("SESClient", "SendBulkTemplatedEmailCommand")
    .f(void 0, void 0)
    .ser(se_SendBulkTemplatedEmailCommand)
    .de(de_SendBulkTemplatedEmailCommand)
    .build() {
}

class SendCustomVerificationEmailCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SendCustomVerificationEmail", {})
    .n("SESClient", "SendCustomVerificationEmailCommand")
    .f(void 0, void 0)
    .ser(se_SendCustomVerificationEmailCommand)
    .de(de_SendCustomVerificationEmailCommand)
    .build() {
}

class SendEmailCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SendEmail", {})
    .n("SESClient", "SendEmailCommand")
    .f(void 0, void 0)
    .ser(se_SendEmailCommand)
    .de(de_SendEmailCommand)
    .build() {
}

class SendRawEmailCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SendRawEmail", {})
    .n("SESClient", "SendRawEmailCommand")
    .f(void 0, void 0)
    .ser(se_SendRawEmailCommand)
    .de(de_SendRawEmailCommand)
    .build() {
}

class SendTemplatedEmailCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SendTemplatedEmail", {})
    .n("SESClient", "SendTemplatedEmailCommand")
    .f(void 0, void 0)
    .ser(se_SendTemplatedEmailCommand)
    .de(de_SendTemplatedEmailCommand)
    .build() {
}

class SetActiveReceiptRuleSetCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SetActiveReceiptRuleSet", {})
    .n("SESClient", "SetActiveReceiptRuleSetCommand")
    .f(void 0, void 0)
    .ser(se_SetActiveReceiptRuleSetCommand)
    .de(de_SetActiveReceiptRuleSetCommand)
    .build() {
}

class SetIdentityDkimEnabledCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SetIdentityDkimEnabled", {})
    .n("SESClient", "SetIdentityDkimEnabledCommand")
    .f(void 0, void 0)
    .ser(se_SetIdentityDkimEnabledCommand)
    .de(de_SetIdentityDkimEnabledCommand)
    .build() {
}

class SetIdentityFeedbackForwardingEnabledCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SetIdentityFeedbackForwardingEnabled", {})
    .n("SESClient", "SetIdentityFeedbackForwardingEnabledCommand")
    .f(void 0, void 0)
    .ser(se_SetIdentityFeedbackForwardingEnabledCommand)
    .de(de_SetIdentityFeedbackForwardingEnabledCommand)
    .build() {
}

class SetIdentityHeadersInNotificationsEnabledCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SetIdentityHeadersInNotificationsEnabled", {})
    .n("SESClient", "SetIdentityHeadersInNotificationsEnabledCommand")
    .f(void 0, void 0)
    .ser(se_SetIdentityHeadersInNotificationsEnabledCommand)
    .de(de_SetIdentityHeadersInNotificationsEnabledCommand)
    .build() {
}

class SetIdentityMailFromDomainCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SetIdentityMailFromDomain", {})
    .n("SESClient", "SetIdentityMailFromDomainCommand")
    .f(void 0, void 0)
    .ser(se_SetIdentityMailFromDomainCommand)
    .de(de_SetIdentityMailFromDomainCommand)
    .build() {
}

class SetIdentityNotificationTopicCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SetIdentityNotificationTopic", {})
    .n("SESClient", "SetIdentityNotificationTopicCommand")
    .f(void 0, void 0)
    .ser(se_SetIdentityNotificationTopicCommand)
    .de(de_SetIdentityNotificationTopicCommand)
    .build() {
}

class SetReceiptRulePositionCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "SetReceiptRulePosition", {})
    .n("SESClient", "SetReceiptRulePositionCommand")
    .f(void 0, void 0)
    .ser(se_SetReceiptRulePositionCommand)
    .de(de_SetReceiptRulePositionCommand)
    .build() {
}

class TestRenderTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "TestRenderTemplate", {})
    .n("SESClient", "TestRenderTemplateCommand")
    .f(void 0, void 0)
    .ser(se_TestRenderTemplateCommand)
    .de(de_TestRenderTemplateCommand)
    .build() {
}

class UpdateAccountSendingEnabledCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "UpdateAccountSendingEnabled", {})
    .n("SESClient", "UpdateAccountSendingEnabledCommand")
    .f(void 0, void 0)
    .ser(se_UpdateAccountSendingEnabledCommand)
    .de(de_UpdateAccountSendingEnabledCommand)
    .build() {
}

class UpdateConfigurationSetEventDestinationCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "UpdateConfigurationSetEventDestination", {})
    .n("SESClient", "UpdateConfigurationSetEventDestinationCommand")
    .f(void 0, void 0)
    .ser(se_UpdateConfigurationSetEventDestinationCommand)
    .de(de_UpdateConfigurationSetEventDestinationCommand)
    .build() {
}

class UpdateConfigurationSetReputationMetricsEnabledCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "UpdateConfigurationSetReputationMetricsEnabled", {})
    .n("SESClient", "UpdateConfigurationSetReputationMetricsEnabledCommand")
    .f(void 0, void 0)
    .ser(se_UpdateConfigurationSetReputationMetricsEnabledCommand)
    .de(de_UpdateConfigurationSetReputationMetricsEnabledCommand)
    .build() {
}

class UpdateConfigurationSetSendingEnabledCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "UpdateConfigurationSetSendingEnabled", {})
    .n("SESClient", "UpdateConfigurationSetSendingEnabledCommand")
    .f(void 0, void 0)
    .ser(se_UpdateConfigurationSetSendingEnabledCommand)
    .de(de_UpdateConfigurationSetSendingEnabledCommand)
    .build() {
}

class UpdateConfigurationSetTrackingOptionsCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "UpdateConfigurationSetTrackingOptions", {})
    .n("SESClient", "UpdateConfigurationSetTrackingOptionsCommand")
    .f(void 0, void 0)
    .ser(se_UpdateConfigurationSetTrackingOptionsCommand)
    .de(de_UpdateConfigurationSetTrackingOptionsCommand)
    .build() {
}

class UpdateCustomVerificationEmailTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "UpdateCustomVerificationEmailTemplate", {})
    .n("SESClient", "UpdateCustomVerificationEmailTemplateCommand")
    .f(void 0, void 0)
    .ser(se_UpdateCustomVerificationEmailTemplateCommand)
    .de(de_UpdateCustomVerificationEmailTemplateCommand)
    .build() {
}

class UpdateReceiptRuleCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "UpdateReceiptRule", {})
    .n("SESClient", "UpdateReceiptRuleCommand")
    .f(void 0, void 0)
    .ser(se_UpdateReceiptRuleCommand)
    .de(de_UpdateReceiptRuleCommand)
    .build() {
}

class UpdateTemplateCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "UpdateTemplate", {})
    .n("SESClient", "UpdateTemplateCommand")
    .f(void 0, void 0)
    .ser(se_UpdateTemplateCommand)
    .de(de_UpdateTemplateCommand)
    .build() {
}

class VerifyDomainDkimCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "VerifyDomainDkim", {})
    .n("SESClient", "VerifyDomainDkimCommand")
    .f(void 0, void 0)
    .ser(se_VerifyDomainDkimCommand)
    .de(de_VerifyDomainDkimCommand)
    .build() {
}

class VerifyDomainIdentityCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "VerifyDomainIdentity", {})
    .n("SESClient", "VerifyDomainIdentityCommand")
    .f(void 0, void 0)
    .ser(se_VerifyDomainIdentityCommand)
    .de(de_VerifyDomainIdentityCommand)
    .build() {
}

class VerifyEmailAddressCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "VerifyEmailAddress", {})
    .n("SESClient", "VerifyEmailAddressCommand")
    .f(void 0, void 0)
    .ser(se_VerifyEmailAddressCommand)
    .de(de_VerifyEmailAddressCommand)
    .build() {
}

class VerifyEmailIdentityCommand extends smithyClient.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        middlewareSerde.getSerdePlugin(config, this.serialize, this.deserialize),
        middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SimpleEmailService", "VerifyEmailIdentity", {})
    .n("SESClient", "VerifyEmailIdentityCommand")
    .f(void 0, void 0)
    .ser(se_VerifyEmailIdentityCommand)
    .de(de_VerifyEmailIdentityCommand)
    .build() {
}

const commands = {
    CloneReceiptRuleSetCommand,
    CreateConfigurationSetCommand,
    CreateConfigurationSetEventDestinationCommand,
    CreateConfigurationSetTrackingOptionsCommand,
    CreateCustomVerificationEmailTemplateCommand,
    CreateReceiptFilterCommand,
    CreateReceiptRuleCommand,
    CreateReceiptRuleSetCommand,
    CreateTemplateCommand,
    DeleteConfigurationSetCommand,
    DeleteConfigurationSetEventDestinationCommand,
    DeleteConfigurationSetTrackingOptionsCommand,
    DeleteCustomVerificationEmailTemplateCommand,
    DeleteIdentityCommand,
    DeleteIdentityPolicyCommand,
    DeleteReceiptFilterCommand,
    DeleteReceiptRuleCommand,
    DeleteReceiptRuleSetCommand,
    DeleteTemplateCommand,
    DeleteVerifiedEmailAddressCommand,
    DescribeActiveReceiptRuleSetCommand,
    DescribeConfigurationSetCommand,
    DescribeReceiptRuleCommand,
    DescribeReceiptRuleSetCommand,
    GetAccountSendingEnabledCommand,
    GetCustomVerificationEmailTemplateCommand,
    GetIdentityDkimAttributesCommand,
    GetIdentityMailFromDomainAttributesCommand,
    GetIdentityNotificationAttributesCommand,
    GetIdentityPoliciesCommand,
    GetIdentityVerificationAttributesCommand,
    GetSendQuotaCommand,
    GetSendStatisticsCommand,
    GetTemplateCommand,
    ListConfigurationSetsCommand,
    ListCustomVerificationEmailTemplatesCommand,
    ListIdentitiesCommand,
    ListIdentityPoliciesCommand,
    ListReceiptFiltersCommand,
    ListReceiptRuleSetsCommand,
    ListTemplatesCommand,
    ListVerifiedEmailAddressesCommand,
    PutConfigurationSetDeliveryOptionsCommand,
    PutIdentityPolicyCommand,
    ReorderReceiptRuleSetCommand,
    SendBounceCommand,
    SendBulkTemplatedEmailCommand,
    SendCustomVerificationEmailCommand,
    SendEmailCommand,
    SendRawEmailCommand,
    SendTemplatedEmailCommand,
    SetActiveReceiptRuleSetCommand,
    SetIdentityDkimEnabledCommand,
    SetIdentityFeedbackForwardingEnabledCommand,
    SetIdentityHeadersInNotificationsEnabledCommand,
    SetIdentityMailFromDomainCommand,
    SetIdentityNotificationTopicCommand,
    SetReceiptRulePositionCommand,
    TestRenderTemplateCommand,
    UpdateAccountSendingEnabledCommand,
    UpdateConfigurationSetEventDestinationCommand,
    UpdateConfigurationSetReputationMetricsEnabledCommand,
    UpdateConfigurationSetSendingEnabledCommand,
    UpdateConfigurationSetTrackingOptionsCommand,
    UpdateCustomVerificationEmailTemplateCommand,
    UpdateReceiptRuleCommand,
    UpdateTemplateCommand,
    VerifyDomainDkimCommand,
    VerifyDomainIdentityCommand,
    VerifyEmailAddressCommand,
    VerifyEmailIdentityCommand,
};
class SES extends SESClient {
}
smithyClient.createAggregatedClient(commands, SES);

const paginateListCustomVerificationEmailTemplates = core.createPaginator(SESClient, ListCustomVerificationEmailTemplatesCommand, "NextToken", "NextToken", "MaxResults");

const paginateListIdentities = core.createPaginator(SESClient, ListIdentitiesCommand, "NextToken", "NextToken", "MaxItems");

const checkState = async (client, input) => {
    let reason;
    try {
        const result = await client.send(new GetIdentityVerificationAttributesCommand(input));
        reason = result;
        try {
            const returnComparator = () => {
                const objectProjection_2 = Object.values(result.VerificationAttributes).map((element_1) => {
                    return element_1.VerificationStatus;
                });
                return objectProjection_2;
            };
            let allStringEq_4 = returnComparator().length > 0;
            for (const element_3 of returnComparator()) {
                allStringEq_4 = allStringEq_4 && element_3 == "Success";
            }
            if (allStringEq_4) {
                return { state: utilWaiter.WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
    }
    catch (exception) {
        reason = exception;
    }
    return { state: utilWaiter.WaiterState.RETRY, reason };
};
const waitForIdentityExists = async (params, input) => {
    const serviceDefaults = { minDelay: 3, maxDelay: 120 };
    return utilWaiter.createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
const waitUntilIdentityExists = async (params, input) => {
    const serviceDefaults = { minDelay: 3, maxDelay: 120 };
    const result = await utilWaiter.createWaiter({ ...serviceDefaults, ...params }, input, checkState);
    return utilWaiter.checkExceptions(result);
};

Object.defineProperty(exports, "$Command", {
    enumerable: true,
    get: function () { return smithyClient.Command; }
});
Object.defineProperty(exports, "__Client", {
    enumerable: true,
    get: function () { return smithyClient.Client; }
});
exports.AccountSendingPausedException = AccountSendingPausedException;
exports.AlreadyExistsException = AlreadyExistsException;
exports.BehaviorOnMXFailure = BehaviorOnMXFailure;
exports.BounceType = BounceType;
exports.BulkEmailStatus = BulkEmailStatus;
exports.CannotDeleteException = CannotDeleteException;
exports.CloneReceiptRuleSetCommand = CloneReceiptRuleSetCommand;
exports.ConfigurationSetAlreadyExistsException = ConfigurationSetAlreadyExistsException;
exports.ConfigurationSetAttribute = ConfigurationSetAttribute;
exports.ConfigurationSetDoesNotExistException = ConfigurationSetDoesNotExistException;
exports.ConfigurationSetSendingPausedException = ConfigurationSetSendingPausedException;
exports.CreateConfigurationSetCommand = CreateConfigurationSetCommand;
exports.CreateConfigurationSetEventDestinationCommand = CreateConfigurationSetEventDestinationCommand;
exports.CreateConfigurationSetTrackingOptionsCommand = CreateConfigurationSetTrackingOptionsCommand;
exports.CreateCustomVerificationEmailTemplateCommand = CreateCustomVerificationEmailTemplateCommand;
exports.CreateReceiptFilterCommand = CreateReceiptFilterCommand;
exports.CreateReceiptRuleCommand = CreateReceiptRuleCommand;
exports.CreateReceiptRuleSetCommand = CreateReceiptRuleSetCommand;
exports.CreateTemplateCommand = CreateTemplateCommand;
exports.CustomMailFromStatus = CustomMailFromStatus;
exports.CustomVerificationEmailInvalidContentException = CustomVerificationEmailInvalidContentException;
exports.CustomVerificationEmailTemplateAlreadyExistsException = CustomVerificationEmailTemplateAlreadyExistsException;
exports.CustomVerificationEmailTemplateDoesNotExistException = CustomVerificationEmailTemplateDoesNotExistException;
exports.DeleteConfigurationSetCommand = DeleteConfigurationSetCommand;
exports.DeleteConfigurationSetEventDestinationCommand = DeleteConfigurationSetEventDestinationCommand;
exports.DeleteConfigurationSetTrackingOptionsCommand = DeleteConfigurationSetTrackingOptionsCommand;
exports.DeleteCustomVerificationEmailTemplateCommand = DeleteCustomVerificationEmailTemplateCommand;
exports.DeleteIdentityCommand = DeleteIdentityCommand;
exports.DeleteIdentityPolicyCommand = DeleteIdentityPolicyCommand;
exports.DeleteReceiptFilterCommand = DeleteReceiptFilterCommand;
exports.DeleteReceiptRuleCommand = DeleteReceiptRuleCommand;
exports.DeleteReceiptRuleSetCommand = DeleteReceiptRuleSetCommand;
exports.DeleteTemplateCommand = DeleteTemplateCommand;
exports.DeleteVerifiedEmailAddressCommand = DeleteVerifiedEmailAddressCommand;
exports.DescribeActiveReceiptRuleSetCommand = DescribeActiveReceiptRuleSetCommand;
exports.DescribeConfigurationSetCommand = DescribeConfigurationSetCommand;
exports.DescribeReceiptRuleCommand = DescribeReceiptRuleCommand;
exports.DescribeReceiptRuleSetCommand = DescribeReceiptRuleSetCommand;
exports.DimensionValueSource = DimensionValueSource;
exports.DsnAction = DsnAction;
exports.EventDestinationAlreadyExistsException = EventDestinationAlreadyExistsException;
exports.EventDestinationDoesNotExistException = EventDestinationDoesNotExistException;
exports.EventType = EventType;
exports.FromEmailAddressNotVerifiedException = FromEmailAddressNotVerifiedException;
exports.GetAccountSendingEnabledCommand = GetAccountSendingEnabledCommand;
exports.GetCustomVerificationEmailTemplateCommand = GetCustomVerificationEmailTemplateCommand;
exports.GetIdentityDkimAttributesCommand = GetIdentityDkimAttributesCommand;
exports.GetIdentityMailFromDomainAttributesCommand = GetIdentityMailFromDomainAttributesCommand;
exports.GetIdentityNotificationAttributesCommand = GetIdentityNotificationAttributesCommand;
exports.GetIdentityPoliciesCommand = GetIdentityPoliciesCommand;
exports.GetIdentityVerificationAttributesCommand = GetIdentityVerificationAttributesCommand;
exports.GetSendQuotaCommand = GetSendQuotaCommand;
exports.GetSendStatisticsCommand = GetSendStatisticsCommand;
exports.GetTemplateCommand = GetTemplateCommand;
exports.IdentityType = IdentityType;
exports.InvalidCloudWatchDestinationException = InvalidCloudWatchDestinationException;
exports.InvalidConfigurationSetException = InvalidConfigurationSetException;
exports.InvalidDeliveryOptionsException = InvalidDeliveryOptionsException;
exports.InvalidFirehoseDestinationException = InvalidFirehoseDestinationException;
exports.InvalidLambdaFunctionException = InvalidLambdaFunctionException;
exports.InvalidPolicyException = InvalidPolicyException;
exports.InvalidRenderingParameterException = InvalidRenderingParameterException;
exports.InvalidS3ConfigurationException = InvalidS3ConfigurationException;
exports.InvalidSNSDestinationException = InvalidSNSDestinationException;
exports.InvalidSnsTopicException = InvalidSnsTopicException;
exports.InvalidTemplateException = InvalidTemplateException;
exports.InvalidTrackingOptionsException = InvalidTrackingOptionsException;
exports.InvocationType = InvocationType;
exports.LimitExceededException = LimitExceededException;
exports.ListConfigurationSetsCommand = ListConfigurationSetsCommand;
exports.ListCustomVerificationEmailTemplatesCommand = ListCustomVerificationEmailTemplatesCommand;
exports.ListIdentitiesCommand = ListIdentitiesCommand;
exports.ListIdentityPoliciesCommand = ListIdentityPoliciesCommand;
exports.ListReceiptFiltersCommand = ListReceiptFiltersCommand;
exports.ListReceiptRuleSetsCommand = ListReceiptRuleSetsCommand;
exports.ListTemplatesCommand = ListTemplatesCommand;
exports.ListVerifiedEmailAddressesCommand = ListVerifiedEmailAddressesCommand;
exports.MailFromDomainNotVerifiedException = MailFromDomainNotVerifiedException;
exports.MessageRejected = MessageRejected;
exports.MissingRenderingAttributeException = MissingRenderingAttributeException;
exports.NotificationType = NotificationType;
exports.ProductionAccessNotGrantedException = ProductionAccessNotGrantedException;
exports.PutConfigurationSetDeliveryOptionsCommand = PutConfigurationSetDeliveryOptionsCommand;
exports.PutIdentityPolicyCommand = PutIdentityPolicyCommand;
exports.ReceiptFilterPolicy = ReceiptFilterPolicy;
exports.ReorderReceiptRuleSetCommand = ReorderReceiptRuleSetCommand;
exports.RuleDoesNotExistException = RuleDoesNotExistException;
exports.RuleSetDoesNotExistException = RuleSetDoesNotExistException;
exports.SES = SES;
exports.SESClient = SESClient;
exports.SESServiceException = SESServiceException;
exports.SNSActionEncoding = SNSActionEncoding;
exports.SendBounceCommand = SendBounceCommand;
exports.SendBulkTemplatedEmailCommand = SendBulkTemplatedEmailCommand;
exports.SendCustomVerificationEmailCommand = SendCustomVerificationEmailCommand;
exports.SendEmailCommand = SendEmailCommand;
exports.SendRawEmailCommand = SendRawEmailCommand;
exports.SendTemplatedEmailCommand = SendTemplatedEmailCommand;
exports.SetActiveReceiptRuleSetCommand = SetActiveReceiptRuleSetCommand;
exports.SetIdentityDkimEnabledCommand = SetIdentityDkimEnabledCommand;
exports.SetIdentityFeedbackForwardingEnabledCommand = SetIdentityFeedbackForwardingEnabledCommand;
exports.SetIdentityHeadersInNotificationsEnabledCommand = SetIdentityHeadersInNotificationsEnabledCommand;
exports.SetIdentityMailFromDomainCommand = SetIdentityMailFromDomainCommand;
exports.SetIdentityNotificationTopicCommand = SetIdentityNotificationTopicCommand;
exports.SetReceiptRulePositionCommand = SetReceiptRulePositionCommand;
exports.StopScope = StopScope;
exports.TemplateDoesNotExistException = TemplateDoesNotExistException;
exports.TestRenderTemplateCommand = TestRenderTemplateCommand;
exports.TlsPolicy = TlsPolicy;
exports.TrackingOptionsAlreadyExistsException = TrackingOptionsAlreadyExistsException;
exports.TrackingOptionsDoesNotExistException = TrackingOptionsDoesNotExistException;
exports.UpdateAccountSendingEnabledCommand = UpdateAccountSendingEnabledCommand;
exports.UpdateConfigurationSetEventDestinationCommand = UpdateConfigurationSetEventDestinationCommand;
exports.UpdateConfigurationSetReputationMetricsEnabledCommand = UpdateConfigurationSetReputationMetricsEnabledCommand;
exports.UpdateConfigurationSetSendingEnabledCommand = UpdateConfigurationSetSendingEnabledCommand;
exports.UpdateConfigurationSetTrackingOptionsCommand = UpdateConfigurationSetTrackingOptionsCommand;
exports.UpdateCustomVerificationEmailTemplateCommand = UpdateCustomVerificationEmailTemplateCommand;
exports.UpdateReceiptRuleCommand = UpdateReceiptRuleCommand;
exports.UpdateTemplateCommand = UpdateTemplateCommand;
exports.VerificationStatus = VerificationStatus;
exports.VerifyDomainDkimCommand = VerifyDomainDkimCommand;
exports.VerifyDomainIdentityCommand = VerifyDomainIdentityCommand;
exports.VerifyEmailAddressCommand = VerifyEmailAddressCommand;
exports.VerifyEmailIdentityCommand = VerifyEmailIdentityCommand;
exports.paginateListCustomVerificationEmailTemplates = paginateListCustomVerificationEmailTemplates;
exports.paginateListIdentities = paginateListIdentities;
exports.waitForIdentityExists = waitForIdentityExists;
exports.waitUntilIdentityExists = waitUntilIdentityExists;
