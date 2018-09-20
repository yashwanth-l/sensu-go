package etcd

import (
	"io/ioutil"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/grpclog"
)

var grpcLogger = logrus.WithField("component", "grpc")

// set the logger for the entire gRPC library to use logrus
func init() {
	v2Logger := grpclog.NewLoggerV2(
		ioutil.Discard,
		grpcLogger.WriterLevel(logrus.WarnLevel),
		grpcLogger.WriterLevel(logrus.ErrorLevel))
	grpclog.SetLoggerV2(v2Logger)
}
