<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:template match="/">
		<xsl:for-each select="CodeLists/CodeList">
			<div class="modal" tabindex="-1" role="dialog" data-keyboard="false">
				<xsl:attribute name="id">
					<xsl:value-of select="concat('CODELIST_',Identification)"/>
				</xsl:attribute>
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title">
								<xsl:value-of select="Identification"/>
							</h1>
						</div>
						<div class="modal-body">
							<p>
								<xsl:value-of select="Description[@lang=($language)]"/>
							</p>
							<table class="table table-striped table-hover table-responsive table-condensed">
								<thead>
									<tr>
										<xsl:choose>
											<xsl:when test="$language='fi'">
												<th>Koodi</th>
												<th>Nimi</th>
												<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
													<th>Selite</th>
												</xsl:if>
											</xsl:when>
											<xsl:when test="$language='sv'">
												<th>Kod</th>
												<th>Namn</th>
												<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
													<th>Förklaring</th>
												</xsl:if>
											</xsl:when>
											<xsl:when test="$language='en'">
												<th>Code</th>
												<th>Name</th>
												<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
													<th>Description</th>
												</xsl:if>
											</xsl:when>
										</xsl:choose>
									</tr>
								</thead>
								<xsl:for-each select="CodeItem">
									<xsl:variable name="start" select="concat(substring(StartDate,1,4), substring(StartDate,6,2), substring(StartDate,9,2))"/>
									<xsl:variable name="end" select="concat(substring(EndDate,1,4), substring(EndDate,6,2), substring(EndDate,9,2))"/>
									<xsl:if test="$messageType > $start and $end > $messageType">
										<tr>
											<td>
												<xsl:choose>
													<xsl:when test="Header=1">
														<b>
															<xsl:value-of select="Code"/>
														</b>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="Code"/>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td>
												<xsl:choose>
													<xsl:when test="Header=1">
														<b>
															<xsl:value-of select="Name[@lang=($language)]"/>
														</b>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="Name[@lang=($language)]"/>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<xsl:if test="count(../CodeItem/Description[@lang=($language)][string(.)]) > 0">
												<td>
													<xsl:choose>
														<xsl:when test="Header=1">
															<b>
																<xsl:value-of select="Description[@lang=($language)]"/>
															</b>
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="Description[@lang=($language)]"/>
														</xsl:otherwise>
													</xsl:choose>
												</td>
											</xsl:if>
										</tr>
									</xsl:if>
								</xsl:for-each>
							</table>
						</div>
					</div>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>