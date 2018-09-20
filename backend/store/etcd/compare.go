package etcd

import (
	"go.etcd.io/etcd/clientv3"
	"github.com/sensu/sensu-go/types"
)

func environmentExistsForResource(r types.MultitenantResource) clientv3.Cmp {
	key := getEnvironmentsPath(r.GetOrganization(), r.GetEnvironment())
	return clientv3.Compare(clientv3.Version(key), ">", 0)
}
