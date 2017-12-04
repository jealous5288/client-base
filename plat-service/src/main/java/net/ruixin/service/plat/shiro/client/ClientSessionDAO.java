package net.ruixin.service.plat.shiro.client;

import net.ruixin.service.plat.shiro.remote.IRemoteService;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.CachingSessionDAO;

import java.io.Serializable;

public class ClientSessionDAO extends CachingSessionDAO {
    private IRemoteService remoteService;
    private String appKey;

    public void setRemoteService(IRemoteService remoteService) {
        this.remoteService = remoteService;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
    }

    protected void doDelete(Session session) {
        remoteService.deleteSession(appKey, session);
    }

    protected void doUpdate(Session session) {
        remoteService.updateSession(appKey, session);
    }

    protected Serializable doCreate(Session session) {
        Serializable sessionId = remoteService.createSession(session);
        assignSessionId(session, sessionId);
        return sessionId;
    }

    protected Session doReadSession(Serializable sessionId) {
        return remoteService.getSession(appKey, sessionId);
    }
}
