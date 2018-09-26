//go:generate go install github.com/sensu/sensu-go/vendor/github.com/gogo/protobuf/protoc-gen-gofast
//go:generate go install github.com/sensu/sensu-go/vendor/github.com/golang/protobuf/protoc-gen-go
//go:generate go install github.com/sensu/sensu-go/vendor/github.com/sensu/sensu-proto/cmd/protoc-gen-sensu
//go:generate -command protoc protoc --gogo_out=Mgoogle/protobuf/timestamp.proto=github.com/gogo/protobuf/types:. --sensu_out=:. -I=../../../vendor/ -I=./ -I=$GOPATH/src
//go:generate protoc types.proto

package v2alpha1
